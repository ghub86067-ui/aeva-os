import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/websearch")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = (url.searchParams.get("q") || "").trim();
        if (!q) return Response.json({ results: [] });
        try {
          const res = await fetch(
            "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(q),
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
              },
            },
          );
          const html = await res.text();
          const results: { title: string; snippet: string; url: string }[] = [];
          const blockRe = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
          let m: RegExpExecArray | null;
          const clean = (s: string) =>
            s
              // strip HTML tags
              .replace(/<[^>]+>/g, " ")
              // decode named entities
              .replace(/&nbsp;/gi, " ")
              .replace(/&amp;/gi, "&")
              .replace(/&quot;/gi, '"')
              .replace(/&apos;/gi, "'")
              .replace(/&lt;/gi, "<")
              .replace(/&gt;/gi, ">")
              // decode numeric entities (decimal + hex)
              .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
                try { return String.fromCodePoint(parseInt(h, 16)); } catch { return ""; }
              })
              .replace(/&#(\d+);/g, (_, d) => {
                try { return String.fromCodePoint(parseInt(d, 10)); } catch { return ""; }
              })
              // decode escaped unicode like \u0001 or \x1b
              .replace(/\\u([0-9a-f]{4})/gi, (_, h) => {
                try { return String.fromCodePoint(parseInt(h, 16)); } catch { return ""; }
              })
              .replace(/\\x([0-9a-f]{2})/gi, (_, h) => {
                try { return String.fromCodePoint(parseInt(h, 16)); } catch { return ""; }
              })
              // remove control + zero-width chars
              .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\uFEFF]/g, " ")
              // strip stray backslashes and bare URLs from snippet body
              .replace(/https?:\/\/\S+/g, "")
              .replace(/\\+/g, " ")
              // collapse whitespace
              .replace(/\s+/g, " ")
              .trim();

          while ((m = blockRe.exec(html)) && results.length < 3) {
            let href = m[1];
            try {
              const u = new URL(href, "https://duckduckgo.com");
              const uddg = u.searchParams.get("uddg");
              if (uddg) href = decodeURIComponent(uddg);
            } catch {}
            const title = clean(m[2]);
            const snippet = clean(m[3]);
            if (!title && !snippet) continue;
            results.push({ title, snippet, url: href });
          }
          return Response.json({ results });
        } catch (e) {
          return Response.json({ results: [], error: String(e) }, { status: 200 });
        }
      },
    },
  },
});