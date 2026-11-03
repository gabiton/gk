import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getInstagramConfig } from "../_lib";

export const runtime = "nodejs";

export async function GET() {
    try {
        const { appId, redirectUri } = getInstagramConfig();
        const state = randomBytes(32).toString("hex");
        const authorizationUrl = new URL("https://www.instagram.com/oauth/authorize");
        authorizationUrl.search = new URLSearchParams({
            client_id: appId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "instagram_business_basic",
            state,
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
