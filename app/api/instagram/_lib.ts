const TOKEN_KEY = "instagram:gabriel_katopodis:token";

export type InstagramToken = {
    access_token: string;
    account_id: string;
    expires_at: number;
};

export function getInstagramConfig() {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const loginConfigId = process.env.META_LOGIN_CONFIG_ID;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!appId || !appSecret || !loginConfigId || !redirectUri || !redisUrl || !redisToken) {
        throw new Error("Instagram OAuth or secure token storage is not configured.");
    }

    return { appId, appSecret, loginConfigId, redirectUri, redisUrl, redisToken };
}

export function getInstagramApiVersion() {
    return process.env.INSTAGRAM_API_VERSION || "v25.0";
}

export function getInstagramGraphUrl(path: string) {
    return `https://graph.facebook.com/${getInstagramApiVersion()}/${path}`;
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

    return JSON.parse(result.result) as InstagramToken;
}

