import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { ToolIcon } from "@/components/tools/ToolIcon";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolSearch } from "@/components/tools/ToolSearch";
import { CtaSection } from "@/components/sections/CtaSection";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay, staggerDelay } from "@/components/motion/motion";
import { toolsUi } from "@/content/tools/ui";
import { assertRegistryIntegrity, liveTools, populatedCategories, tools } from "@/lib/tools";
import { buildMetadata, itemListJsonLd, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { locales, path, t, type Locale } from "@/lib/i18n";

// Contrôle d'intégrité au build : slugs uniques, pas de collision avec une
// catégorie, relations réciproques. Mieux vaut casser ici qu'en production.
assertRegistryIntegrity();

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    segment: "tools",
    title: t(toolsUi.heroTitle, locale),
    description: t(toolsUi.heroDescription, locale),
  });
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const groups = populatedCategories();

  return (
    <>
      <JsonLd data={websiteJsonLd(locale)} />
      <JsonLd
        data={itemListJsonLd(
          liveTools.map((tool) => ({
            name: tool.name,
            url: `${site.url}/${locale}/tools/${tool.slug}/`,
            description: t(tool.tagline, locale),
          })),
          t(toolsUi.heroTitle, locale),
        )}
      />
      <Section labelledBy="tools-title">
        <Reveal delay={revealDelay.title}>
          <div className="mb-12 flex flex-col items-start gap-3">
            <Badge>{t(toolsUi.heroBadge, locale)}</Badge>
            <h1 id="tools-title" className="t-h1 balanced max-w-[720px]">
              {t(toolsUi.heroTitle, locale)}
            </h1>
            <p className="t-body-lg max-w-[560px]">{t(toolsUi.heroDescription, locale)}</p>
            <p className="t-meta mt-1">
              {liveTools.length} / {tools.length} {t(toolsUi.toolsCount, locale)}
            </p>
          </div>
        </Reveal>

        <Reveal delay={revealDelay.content}>
          <ToolSearch locale={locale} />
        </Reveal>

        <div className="flex flex-col gap-14">
          {groups.map(({ category, all, live }, index) => (
            <Reveal key={category.id} delay={staggerDelay(index, revealDelay.cards)}>
              <div>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="t-h3 flex items-center gap-2.5">
                    <ToolIcon name={category.icon} size={22} className="text-gray-500" />
                    <Link href={path(locale, `tools/${category.id}`)} className="hover:underline">
                      {t(category.name, locale)}
                    </Link>
                  </h2>
                  <p className="t-meta">
                    {live.length} / {all.length} {t(toolsUi.toolsCount, locale)}
                  </p>
                </div>
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {all.map((tool) => (
                    <li key={tool.slug}>
                      <ToolCard tool={tool} locale={locale} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaSection locale={locale} />
    </>
  );
}
