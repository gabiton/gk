import { NextResponse } from "next/server";

const TOKEN_KEY = "instagram:gabriel_katopodis:token";

export type InstagramToken = {
    access_token: string;
    user_id: string;
    expires_at: number;
};

export function getInstagramConfig() {
    const appId = process.env.INSTAGRAM_APP_ID;
    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!appId || !appSecret || !redirectUri || !redisUrl || !redisToken) {
        throw new Error("Instagram OAuth or secure token storage is not configured.");
    }

    return { appId, appSecret, redirectUri, redisUrl, redisToken };
}

export function getInstagramApiVersion() {
    return process.env.INSTAGRAM_API_VERSION || "v25.0";
}

export async function saveInstagramToken(token: InstagramToken) {
    const { redisUrl, redisToken } = getInstagramConfig();
    const response = await fetch(redisUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${redisToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(["SET", TOKEN_KEY, JSON.stringify(token)]),
        cache: "no-store",
    });

    if (!response.ok) throw new Error("Could not save Instagram token.");
}

export async function readInstagramToken(): Promise<InstagramToken | null> {
    const { redisUrl, redisToken } = getInstagramConfig();
    const response = await fetch(redisUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${redisToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(["GET", TOKEN_KEY]),
        cache: "no-store",
    });

    if (!response.ok) throw new Error("Could not read Instagram token.");
    const result = (await response.json()) as { result?: string | null };
    if (!result.result) return null;

    const token = JSON.parse(result.result) as InstagramToken;
    const refreshThreshold = 7 * 24 * 60 * 60 * 1000;
    if (token.expires_at - Date.now() > refreshThreshold) return token;
    if (token.expires_at <= Date.now()) return token;

    const refreshUrl = new URL("https://graph.instagram.com/refresh_access_token");
    refreshUrl.search = new URLSearchParams({
        grant_type: "ig_refresh_token",
        access_token: token.access_token,
    }).toString();
    const refreshResponse = await fetch(refreshUrl, { cache: "no-store" });
    const refreshed = (await refreshResponse.json()) as {
        access_token?: string;
        expires_in?: number;
    };

    if (!refreshResponse.ok || !refreshed.access_token) return token;

    const updatedToken = {
        ...token,
        access_token: refreshed.access_token,
        expires_at: Date.now() + (refreshed.expires_in ?? 5_184_000) * 1000,
    };
    await saveInstagramToken(updatedToken);
    return updatedToken;
}

export function instagramError(message: string, status = 500) {
    return NextResponse.json({ error: message }, { status });
}
