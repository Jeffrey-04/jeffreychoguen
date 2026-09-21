import { site } from "@/content/site";
import { getPosts } from "@/lib/writing";
import { defaultLocale } from "@/lib/i18n";

/** Route statique : obligatoire avec output: "export". */
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] as string,
  );
}

export function GET() {
  const posts = getPosts(defaultLocale);
  const updated = posts[0]?.date ?? new Date().toISOString().slice(0, 10);

  const items = posts
    .map((post) => {
      const url = `${site.url}/${defaultLocale}/writing/${post.slug}/`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} — Engineering notes</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.tagline.en)}</description>
    <language>${defaultLocale}</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
