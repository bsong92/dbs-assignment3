import { NextResponse } from "next/server";

/**
 * Server-side proxy to the MyMemory Translation API.
 * Browser → /api/translate → MyMemory → shaped JSON → Browser
 *
 * Why proxy:
 * - Lets us shape the response (MyMemory returns lots of fields we don't need)
 * - Avoids CORS
 * - Same pattern we'd use with a keyed API later
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const direction = searchParams.get("dir") ?? "en-zh"; // en-zh or zh-en

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing query parameter 'q'" },
      { status: 400 }
    );
  }

  const langpair = direction === "zh-en" ? "zh-CN|en" : "en|zh-CN";

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        query.trim()
      )}&langpair=${langpair}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Translation service unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Shape the response — only send what the frontend needs
    type Match = {
      translation?: string;
      quality?: string | number;
      reference?: string;
    };
    const matches: Match[] = Array.isArray(data?.matches) ? data.matches : [];

    return NextResponse.json({
      query: query.trim(),
      direction,
      translation: data?.responseData?.translatedText ?? "",
      alternatives: matches
        .map((m) => m.translation)
        .filter(
          (t): t is string =>
            typeof t === "string" && t.length > 0
        )
        .filter((t, i, arr) => arr.indexOf(t) === i) // dedupe
        .slice(0, 5),
    });
  } catch (err) {
    console.error("Translate API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch translation" },
      { status: 500 }
    );
  }
}
