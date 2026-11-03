import { NextRequest, NextResponse } from "next/server";
import {
    getInstagramConfig,
    getInstagramGraphUrl,
    saveInstagramToken,
} from "../_lib";

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
        const tokenUrl = new URL(getInstagramGraphUrl("oauth/access_token"));
        tokenUrl.search = new URLSearchParams({
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
        }).toString();
        const tokenResponse = await fetch(tokenUrl, { cache: "no-store" });
        const tokenResult = (await tokenResponse.json()) as {
            access_token?: string;
            expires_in?: number;
            error?: { message?: string };
        };

        if (!tokenResponse.ok || !tokenResult.access_token) {
            throw new Error(tokenResult.error?.message || "Meta code exchange failed.");
        }

        const accountsUrl = new URL(getInstagramGraphUrl("me/assigned_instagram_accounts"));
        accountsUrl.search = new URLSearchParams({
            fields: "id,username",
            access_token: tokenResult.access_token,
        }).toString();
        const accountsResponse = await fetch(accountsUrl, { cache: "no-store" });
        const accountsResult = (await accountsResponse.json()) as {
            data?: Array<{ id: string; username?: string }>;
            error?: { message?: string };
        };
        const account = accountsResult.data?.[0];

        if (!accountsResponse.ok || !account?.id) {
            throw new Error(
                accountsResult.error?.message ||
                    "No Instagram account was assigned to the authorized token.",
            );
        }

        await saveInstagramToken({
            access_token: tokenResult.access_token,
            account_id: account.id,
            expires_at: tokenResult.expires_in
                ? Date.now() + tokenResult.expires_in * 1000
                : Number.MAX_SAFE_INTEGER,
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
