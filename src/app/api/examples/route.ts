import { NextResponse } from "next/server";

/**
 * Server-side proxy to the Tatoeba sentence API.
 * Browser → /api/examples?q=你好 → Tatoeba → shaped JSON → Browser
 *
 * Returns Chinese example sentences containing the query, with English translations.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing query parameter 'q'" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://tatoeba.org/en/api_v0/search?from=cmn&to=eng&query=${encodeURIComponent(
        query.trim()
      )}&sort=relevance`,
      {
        cache: "no-store",
        headers: {
          "User-Agent": "Wordkeep-Learning-App",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Example sentence service unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Tatoeba returns a `results` array with { text, translations: [[{ text, lang }, ...]] }
    type Translation = { text?: string; lang?: string };
    type Result = {
      text?: string;
      translations?: Translation[][];
    };
    const results: Result[] = Array.isArray(data?.results) ? data.results : [];

    const sentences = results
      .slice(0, 6)
      .map((r) => {
        const chinese = r.text ?? "";
        // Translations is nested arrays; flatten and find the first English one
        const flat: Translation[] = (r.translations ?? []).flat();
        const english =
          flat.find((t) => t.lang === "eng")?.text ?? "";
        return { chinese, english };
      })
      .filter((s) => s.chinese.length > 0);

    return NextResponse.json({
      query: query.trim(),
      sentences,
    });
  } catch (err) {
    console.error("Examples API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch example sentences" },
      { status: 500 }
    );
  }
}
