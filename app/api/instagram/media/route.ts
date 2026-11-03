import { NextResponse } from "next/server";
import { getInstagramApiVersion, getInstagramConfig, readInstagramToken } from "../_lib";

export const runtime = "nodejs";

export async function GET() {
    try {
        getInstagramConfig();
        const token = await readInstagramToken();
        if (!token) {
            return NextResponse.json({ error: "Instagram account is not connected." }, { status: 503 });
        }
        if (token.expires_at <= Date.now()) {
            return NextResponse.json({ error: "Instagram token expired; reconnect the account." }, { status: 401 });
        }

        const url = new URL(`https://graph.instagram.com/${getInstagramApiVersion()}/${token.user_id}/media`);
        url.search = new URLSearchParams({
            fields: "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
            limit: "8",
            access_token: token.access_token,
        }).toString();
        const instagramResponse = await fetch(url, {
            next: { revalidate: 300 },
        });
        const result = await instagramResponse.json();

        if (!instagramResponse.ok) {
            console.error("Instagram media request failed:", result);
            return NextResponse.json({ error: "Could not load Instagram media." }, { status: 502 });
        }

        return NextResponse.json(result, {
            headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
        });
    } catch {
        return NextResponse.json(
            { error: "Instagram integration is not configured." },
            { status: 503 },
        );
    }
}
