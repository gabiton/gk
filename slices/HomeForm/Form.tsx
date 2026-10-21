"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type FormConfig = {
    recepcion_habilitada: boolean;
    campos: {
        telefono: { incluido: boolean; requerido: boolean };
        email: { incluido: boolean; requerido: boolean };
        al_menos_un_contacto: boolean;
    };
    aviso: {
        version: string;
        texto_casilla: string;
        url: string;
    };
};

type ApiError = {
    campo?: string;
    mensaje?: string;
};

type SubmitResult = {
    ok?: boolean;
    codigo?: string;
    detail?: string;
    errores?: ApiError[];
};

type PendingSubmission = {
    key: string;
    serializedPayload: string;
};

export function Form() {
    const [config, setConfig] = useState<FormConfig | null>(null);
    const [configError, setConfigError] = useState(false);
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [fieldErrors, setFieldErrors] = useState<ApiError[]>([]);
    const [pendingSubmission, setPendingSubmission] =
        useState<PendingSubmission | null>(null);
    const submitting = useRef(false);

    useEffect(() => {
        let active = true;

        fetch("/api/home-form", { cache: "no-store" })
            .then(async (response) => {
                if (!response.ok)
                    throw new Error("No se pudo cargar el formulario");
                return (await response.json()) as FormConfig;
            })
            .then((data) => {
                if (active) setConfig(data);
            })
            .catch(() => {
                if (active) setConfigError(true);
            });

        return () => {
            active = false;
        };
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (
            !config ||
            sending ||
            submitting.current ||
            !config.recepcion_habilitada
        )
            return;

        const form = event.currentTarget;
        const formData = new FormData(form);
        const nombre = String(formData.get("nombre") ?? "").trim();
        const apellido = String(formData.get("apellido") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const telefono = String(formData.get("telefono") ?? "").trim();
        const consentimiento = formData.get("consentimiento") === "on";

        setFeedback("");
        setFieldErrors([]);

        if (config.campos.al_menos_un_contacto && !email && !telefono) {
            setFieldErrors([
                { campo: "email", mensaje: "Ingresá un email o un teléfono." },
            ]);
            return;
        }

        if (!consentimiento) {
            setFieldErrors([
                {
                    campo: "consentimiento",
                    mensaje: "Necesitamos tu consentimiento para continuar.",
                },
            ]);
            return;
        }

        const payload = { nombre, apellido, email, telefono, consentimiento };
        const serializedPayload = JSON.stringify(payload);
        const submission =
            pendingSubmission?.serializedPayload === serializedPayload
                ? pendingSubmission
                : { key: crypto.randomUUID(), serializedPayload };
        setPendingSubmission(submission);

        submitting.current = true;
        setSending(true);
        try {
            const response = await fetch("/api/home-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Idempotency-Key": submission.key,
                },
                body: serializedPayload,
            });
            const result = (await response.json()) as SubmitResult;

            if (!response.ok || !result.ok) {
                if (
                    response.status < 500 &&
                    response.status !== 429 &&
                    result.codigo !== "IDEMPOTENCY_CONFLICT"
                ) {
                    setPendingSubmission(null);
                }
                setFieldErrors(result.errores ?? []);
                if (result.codigo === "RECEPCION_PAUSADA" && config) {
                    setConfig({ ...config, recepcion_habilitada: false });
                }
                setFeedback(
                    result.codigo === "RECEPCION_PAUSADA"
                        ? ""
                        : result.detail ||
                              "No se pudo enviar el formulario. Probá nuevamente más tarde.",
                );
                return;
            }

            form.reset();
            setPendingSubmission(null);
            setFeedback("Datos recibidos. ¡Gracias por sumarte!");
        } catch {
            setFeedback(
                "No se pudo conectar. Revisá tu conexión e intentá nuevamente.",
            );
        } finally {
            submitting.current = false;
            setSending(false);
        }
    }

    if (configError) {
        return (
            <p className="HomeForm__feedback" role="status" aria-live="polite">
                No se pudo consultar la disponibilidad del formulario.
            </p>
        );
    }

    if (!config) {
        return (
            <p className="HomeForm__feedback" role="status" aria-live="polite">
                Cargando formulario...
            </p>
        );
    }

    if (!config.recepcion_habilitada) {
        return (
            <p className="HomeForm__feedback" role="status" aria-live="polite">
                El formulario no está recibiendo respuestas por el momento.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="field">
                <input
                    name="nombre"
                    type="text"
                    placeholder="Nombre"
                    autoComplete="given-name"
                    maxLength={100}
                    required
                    disabled={sending}
                />
            </div>
            <div className="field">
                <input
                    name="apellido"
                    type="text"
                    placeholder="Apellido"
                    autoComplete="family-name"
                    maxLength={100}
                    required
                    disabled={sending}
                />
            </div>
            {config?.campos.email.incluido && (
                <div className="field">
                    <input
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        autoComplete="email"
                        maxLength={254}
                        required={config.campos.email.requerido}
                        disabled={sending}
                    />
                </div>
            )}
            {config?.campos.telefono.incluido && (
                <div className="field">
                    <input
                        name="telefono"
                        type="tel"
                        placeholder="Celular (+549...)"
                        autoComplete="tel"
                        inputMode="tel"
                        pattern="\\+[1-9][0-9]{5,14}"
                        maxLength={16}
                        required={config.campos.telefono.requerido}
                        disabled={sending}
                        title="Usá formato internacional: + y entre 6 y 15 dígitos, sin espacios."
                    />
                </div>
            )}

            {config && (
                <div className="HomeForm__consent">
                    <label>
                        <input
                            name="consentimiento"
                            type="checkbox"
                            required
                            disabled={sending}
                        />
                        <span>{config.aviso.texto_casilla}</span>
                    </label>
                    <a href={config.aviso.url} target="_blank" rel="noreferrer">
                        Ver aviso de privacidad
                    </a>
                </div>
            )}

            {fieldErrors.length > 0 && (
                <ul className="HomeForm__errors" role="alert">
                    {fieldErrors.map((error, index) => (
                        <li key={`${error.campo ?? "campo"}-${index}`}>
                            {error.mensaje}
                        </li>
                    ))}
                </ul>
            )}

            {feedback && (
                <p
                    className="HomeForm__feedback"
                    role="status"
                    aria-live="polite"
                >
                    {feedback}
                </p>
            )}
            <div className="submit">
                <button
                    type="submit"
                    disabled={sending}
                >
                    {sending ? "Enviando..." : "Quiero ser parte"}
                </button>
            </div>
        </form>
    );
}
