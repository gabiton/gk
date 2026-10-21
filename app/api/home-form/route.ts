import { NextResponse } from "next/server";

export const runtime = "nodejs";

const integrationId =
    process.env.CRM_FORM_ID || "3ea2acd4-6503-42c1-ae1d-046371f7d497";
const apiBase = "https://pba27.lat/api/integraciones/v1";
const requestTimeoutMs = 10_000;

type IntegrationConfig = {
    recepcion_habilitada: boolean;
    endpoint_registros: string;
    campos: {
        telefono: { incluido: boolean; requerido: boolean };
        email: { incluido: boolean; requerido: boolean };
        al_menos_un_contacto: boolean;
        partido: { incluido: boolean; requerido: boolean };
    };
    aviso: {
        version: string;
        texto_casilla: string;
        url: string;
    };
};

type ProblemResponse = {
    codigo?: string;
    detail?: string;
    solicitud_id?: string;
    errores?: { campo?: string; codigo?: string; mensaje?: string }[];
    estado?: string;
};

function json(data: unknown, status = 200) {
    return NextResponse.json(data, {
        status,
        headers: { "Cache-Control": "no-store" },
    });
}

async function getIntegrationConfig(): Promise<IntegrationConfig | null> {
    try {
        const response = await fetch(
            `${apiBase}/formularios/${integrationId}/configuracion`,
            {
                cache: "no-store",
                redirect: "manual",
                signal: AbortSignal.timeout(requestTimeoutMs),
            },
        );
        if (!response.ok) return null;

        const config = (await response.json()) as IntegrationConfig;
        if (
            !config?.aviso?.version ||
            !config.aviso.texto_casilla ||
            !config.aviso.url ||
            !config.endpoint_registros
        ) {
            return null;
        }
        if (new URL(config.endpoint_registros).origin !== new URL(apiBase).origin) {
            return null;
        }
        return config;
    } catch {
        return null;
    }
}

export async function GET() {
    const config = await getIntegrationConfig();
    if (!config) {
        return json({ error: "CONFIGURACION_NO_DISPONIBLE" }, 503);
    }

    return json({
        recepcion_habilitada: config.recepcion_habilitada,
        campos: config.campos,
        aviso: config.aviso,
    });
}

function validateInput(input: unknown) {
    const data =
        input && typeof input === "object"
            ? (input as Record<string, unknown>)
            : {};
    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";
    const apellido =
        typeof data.apellido === "string" ? data.apellido.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim() : "";
    const telefono =
        typeof data.telefono === "string" ? data.telefono.trim() : "";
    const errores: { campo: string; codigo: string; mensaje: string }[] = [];
    const invalidName = (value: string) =>
        !value ||
        value.length > 100 ||
        /[<>\u0000-\u001f\u007f]/.test(value);

    if (invalidName(nombre)) {
        errores.push({
            campo: "nombre",
            codigo: "FORMATO_INVALIDO",
            mensaje: "Ingresá un nombre válido, de hasta 100 caracteres.",
        });
    }
    if (invalidName(apellido)) {
        errores.push({
            campo: "apellido",
            codigo: "FORMATO_INVALIDO",
            mensaje: "Ingresá un apellido válido, de hasta 100 caracteres.",
        });
    }
    if (nombre.length + apellido.length > 200) {
        errores.push({
            campo: "apellido",
            codigo: "DEMASIADO_LARGO",
            mensaje: "El nombre y el apellido no pueden superar 200 caracteres en total.",
        });
    }
    if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        errores.push({
            campo: "email",
            codigo: "FORMATO_INVALIDO",
            mensaje: "Ingresá una dirección de email válida.",
        });
    }
    if (telefono && !/^\+[1-9]\d{5,14}$/.test(telefono)) {
        errores.push({
            campo: "telefono",
            codigo: "FORMATO_INVALIDO",
            mensaje: "Usá formato internacional: + y entre 6 y 15 dígitos, sin espacios.",
        });
    }
    if (!email && !telefono) {
        errores.push({
            campo: "email",
            codigo: "REQUERIDO",
            mensaje: "Ingresá un email o un teléfono para que podamos contactarte.",
        });
    }
    if (data.consentimiento !== true) {
        errores.push({
            campo: "consentimiento",
            codigo: "REQUERIDO",
            mensaje: "Necesitamos tu consentimiento para continuar.",
        });
    }

    return { nombre, apellido, email, telefono, errores };
}

export async function POST(request: Request) {
    const idempotencyKey = request.headers.get("Idempotency-Key") || "";
    if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            idempotencyKey,
        )
    ) {
        return json(
            {
                codigo: "IDEMPOTENCY_KEY_INVALIDA",
                detail: "No se pudo identificar este envío. Actualizá la página e intentá nuevamente.",
            },
            400,
        );
    }

    let input: unknown;
    try {
        const body = await request.text();
        if (Buffer.byteLength(body, "utf8") > 16 * 1024) {
            return json(
                {
                    codigo: "CUERPO_DEMASIADO_GRANDE",
                    detail: "El envío supera el tamaño permitido.",
                },
                413,
            );
        }
        input = JSON.parse(body);
    } catch {
        return json({ codigo: "JSON_INVALIDO", detail: "El envío no tiene un formato válido." }, 400);
    }

    const { nombre, apellido, email, telefono, errores } = validateInput(input);
    if (errores.length) {
        return json(
            {
                codigo: "DATOS_INVALIDOS",
                detail: "Revisá los datos ingresados.",
                errores,
            },
            422,
        );
    }

    const config = await getIntegrationConfig();
    if (!config) {
        return json(
            {
                codigo: "SERVICIO_NO_DISPONIBLE",
                detail: "No se pudo verificar la disponibilidad del formulario.",
            },
            503,
        );
    }
    if (!config.recepcion_habilitada) {
        return json(
            {
                codigo: "RECEPCION_PAUSADA",
                detail: "El formulario no está recibiendo respuestas por el momento.",
            },
            409,
        );
    }

    if (
        (config.campos.email.requerido && !email) ||
        (config.campos.telefono.requerido && !telefono) ||
        (config.campos.al_menos_un_contacto &&
            !email &&
            !telefono)
    ) {
        return json(
            {
                codigo: "DATOS_INVALIDOS",
                detail: "Ingresá los datos de contacto solicitados.",
                errores: [
                    {
                        campo: "email",
                        codigo: "REQUERIDO",
                        mensaje: "Ingresá un email o un teléfono para que podamos contactarte.",
                    },
                ],
            },
            422,
        );
    }

    const token = process.env.CRM_TOKEN;
    if (!token) {
        return json(
            {
                codigo: "CONFIGURACION_INCOMPLETA",
                detail: "El formulario no está disponible en este momento.",
            },
            503,
        );
    }

    const payload: Record<string, string | boolean> = {
        nombre,
        apellido,
        consentimiento: true,
        aviso_version: config.aviso.version,
    };
    if (config.campos.email.incluido && email) payload.email = email;
    if (config.campos.telefono.incluido && telefono) payload.telefono = telefono;

    try {
        const response = await fetch(config.endpoint_registros, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json; charset=utf-8",
                "Idempotency-Key": idempotencyKey,
            },
            body: JSON.stringify(payload),
            cache: "no-store",
            redirect: "manual",
            signal: AbortSignal.timeout(requestTimeoutMs),
        });
        const result = (await response.json().catch(() => ({}))) as ProblemResponse;

        if (
            (response.status === 200 || response.status === 201) &&
            result.estado === "recibido"
        ) {
            return json({ ok: true }, response.status);
        }

        return json(
            {
                codigo: result.codigo || "SERVICIO_NO_DISPONIBLE",
                detail:
                    result.codigo === "DATOS_INVALIDOS"
                        ? "Revisá los datos ingresados."
                        : "No se pudo completar el envío. Probá nuevamente más tarde.",
                errores: result.errores?.map(({ campo, codigo, mensaje }) => ({
                    campo,
                    codigo,
                    mensaje,
                })),
                solicitud_id: result.solicitud_id,
            },
            response.status >= 400 && response.status < 600
                ? response.status
                : 503,
        );
    } catch {
        return json(
            {
                codigo: "SERVICIO_NO_DISPONIBLE",
                detail: "No se pudo conectar con el servicio. Intentá más tarde.",
            },
            503,
        );
    }
}
