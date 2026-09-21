import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { CtaSection } from "@/components/sections/CtaSection";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay, staggerDelay } from "@/components/motion/motion";
import { sections, ui } from "@/content/dictionary";
import { getAllSlugs, getPost, getPosts } from "@/lib/writing";
import { buildMetadata } from "@/lib/seo";
import { locales, path, t, type Locale } from "@/lib/i18n";

type Params = { locale: Locale; slug?: string[] };

/**
 * Catch-all optionnel : la même route sert la liste (/writing/) et chaque
 * article (/writing/<slug>/). Ce choix permet à l'export statique de réussir
 * tant qu'aucun article n'est publié — une route [slug] classique échouerait
 * sur un generateStaticParams vide.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) => [
    { locale, slug: [] as string[] },
    ...getAllSlugs().map((slug) => ({ locale, slug: [slug] })),
  ]);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const current = slug?.[0];

  if (!current) {
    return buildMetadata({
      locale,
      segment: "writing",
      title: t(sections.writing.title, locale),
      description: t(sections.writing.description, locale),
    });
  }

  const post = getPost(current, locale);
  if (!post) return {};
  return buildMetadata({
    locale,
    segment: `writing/${current}`,
    title: post.title,
    description: post.description,
  });
}

export default async function WritingPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const current = slug?.[0];

  if (current) return <Article locale={locale} slug={current} />;

  const posts = getPosts(locale);

  return (
    <>
      <Section labelledBy="writing-title">
        <Reveal delay={revealDelay.title}>
          <div className="mb-16 flex flex-col items-start gap-3">
            <Badge>{t(sections.writing.badge, locale)}</Badge>
            <h1 id="writing-title" className="t-h1 balanced max-w-[720px]">
              {t(sections.writing.title, locale)}
            </h1>
            <p className="t-body-lg max-w-[520px]">{t(sections.writing.description, locale)}</p>
          </div>
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={revealDelay.content}>
            <Card>
              <CardBody className="items-start md:p-12">
                <p className="t-body-lg max-w-[520px]">{t(ui.noArticlesYet, locale)}</p>
                <a href="/feed.xml" className="t-body mt-2 text-gray-900 underline underline-offset-4">
                  RSS
                </a>
              </CardBody>
            </Card>
          </Reveal>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={staggerDelay(index % 3, revealDelay.cards)}>
                <Card className="h-full" interactive>
                  <Link href={path(locale, `writing/${post.slug}`)} className="block">
                    <CardBody>
                      <p className="t-meta">
                        {post.category} · {post.minutes} {t(ui.minRead, locale)}
                      </p>
                      <h2 className="t-h4">{post.title}</h2>
                      <p className="t-body">{post.description}</p>
                    </CardBody>
                  </Link>
                </Card>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
      <CtaSection locale={locale} />
    </>
  );
}

function Article({ locale, slug }: { locale: Locale; slug: string }) {
  const post = getPost(slug, locale);
  if (!post) notFound();

  return (
    <>
      <Section>
        <Link href={path(locale, "writing")} className="t-body-sm mb-8 inline-block hover:text-gray-900">
          ← {t(ui.backToWriting, locale)}
        </Link>
        <article className="mx-auto max-w-[720px]">
          <header className="mb-10 flex flex-col gap-3">
            <p className="t-meta">
              <time dateTime={post.date}>{post.date}</time> · {post.category} · {post.minutes}{" "}
              {t(ui.minRead, locale)}
            </p>
            <h1 className="t-h2 balanced">{post.title}</h1>
            <p className="t-body-lg">{post.description}</p>
          </header>
          <div className="flex flex-col gap-5 [&_h2]:t-h3 [&_h3]:t-h4 [&_p]:t-body-lg [&_li]:t-body-lg [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-gray-900 [&_a]:underline [&_a]:underline-offset-4">
            <MDXRemote source={post.body} />
          </div>
        </article>
      </Section>
      <CtaSection locale={locale} />
    </>
  );
}
