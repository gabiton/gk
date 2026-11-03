import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getInstagramConfig } from "../_lib";

export const runtime = "nodejs";

export async function GET() {
    try {
        const { appId, loginConfigId, redirectUri } = getInstagramConfig();
        const state = randomBytes(32).toString("hex");
        const authorizationUrl = new URL("https://www.facebook.com/dialog/oauth");
        authorizationUrl.search = new URLSearchParams({
            client_id: appId,
            config_id: loginConfigId,
            redirect_uri: redirectUri,
            response_type: "code",
            state,
            override_default_response_type: "true",
        }).toString();

        const response = NextResponse.redirect(authorizationUrl);
        response.cookies.set("instagram_oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/api/instagram/callback",
            maxAge: 600,
        });
        return response;
    } catch {
        return NextResponse.json(
            { error: "Instagram OAuth is not configured on the server." },
            { status: 503 },
        );
    }
}
