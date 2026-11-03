import { NextRequest, NextResponse } from "next/server";
import { getInstagramConfig, saveInstagramToken } from "../_lib";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    const storedState = request.cookies.get("instagram_oauth_state")?.value;
    const clearStateCookie = (response: NextResponse) => {
        response.cookies.set("instagram_oauth_state", "", {
            path: "/api/instagram/callback",
            maxAge: 0,
        });
        return response;
    };

    if (searchParams.has("error") || !code) {
        return clearStateCookie(
            NextResponse.json(
                { error: "Instagram authorization was cancelled or failed." },
                { status: 400 },
            ),
        );
    }

    if (!returnedState || !storedState || returnedState !== storedState) {
        return clearStateCookie(
            NextResponse.json({ error: "Invalid OAuth state." }, { status: 400 }),
        );
    }

    try {
        const { appId, appSecret, redirectUri } = getInstagramConfig();
        const shortLivedForm = new URLSearchParams({
            client_id: appId,
            client_secret: appSecret,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
            code,
        });
        const shortLivedResponse = await fetch(
            "https://api.instagram.com/oauth/access_token",
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: shortLivedForm,
                cache: "no-store",
            },
        );
        const shortLived = (await shortLivedResponse.json()) as {
            access_token?: string;
            user_id?: string | number;
            error_message?: string;
        };

        if (!shortLivedResponse.ok || !shortLived.access_token || !shortLived.user_id) {
            throw new Error(shortLived.error_message || "Instagram code exchange failed.");
        }

        const longLivedUrl = new URL("https://graph.instagram.com/access_token");
        longLivedUrl.search = new URLSearchParams({
            grant_type: "ig_exchange_token",
            client_secret: appSecret,
            access_token: shortLived.access_token,
        }).toString();
        const longLivedResponse = await fetch(longLivedUrl, { cache: "no-store" });
        const longLived = (await longLivedResponse.json()) as {
            access_token?: string;
            expires_in?: number;
            error?: { message?: string };
        };

        if (!longLivedResponse.ok || !longLived.access_token) {
            throw new Error(longLived.error?.message || "Long-lived token exchange failed.");
        }

        await saveInstagramToken({
            access_token: longLived.access_token,
            user_id: String(shortLived.user_id),
            expires_at: Date.now() + (longLived.expires_in ?? 5_184_000) * 1000,
        });

        return clearStateCookie(
            NextResponse.redirect(new URL("/?instagram=connected", request.url)),
        );
    } catch (error) {
        console.error("Instagram OAuth callback failed:", error);
        return clearStateCookie(
            NextResponse.json(
                { error: "Instagram could not be connected. Check server configuration and logs." },
                { status: 502 },
            ),
        );
    }
}
