import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/lib/i18n";

const DIR = path.join(process.cwd(), "content/writing");

export type Post = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  minutes: number;
  body: string;
};

/**
 * Articles MDX. Nommage : `<slug>.<locale>.mdx` — un fichier par langue,
 * slug identique dans les deux (design.md §11.1).
 * Front matter attendu : title, description, date, category, tags.
 */
export function getPosts(locale?: Locale): Post[] {
  if (!fs.existsSync(DIR)) return [];

  const posts = fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const [slug, fileLocale] = file.replace(/\.mdx$/, "").split(".");
      const raw = fs.readFileSync(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);

      return {
        slug,
        locale: (fileLocale as Locale) ?? "en",
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        date: String(data.date ?? ""),
        category: String(data.category ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        minutes: Math.max(1, Math.round(readingTime(content).minutes)),
        body: content,
      } satisfies Post;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return locale ? posts.filter((post) => post.locale === locale) : posts;
}

export function getPost(slug: string, locale: Locale): Post | undefined {
  return getPosts(locale).find((post) => post.slug === slug);
}

/** Slugs distincts, toutes langues confondues — pour generateStaticParams. */
export function getAllSlugs(): string[] {
  return Array.from(new Set(getPosts().map((post) => post.slug)));
}
