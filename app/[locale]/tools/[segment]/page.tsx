import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { ToolIcon } from "@/components/tools/ToolIcon";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolShell } from "@/components/tools/ToolShell";
import { ToolRuntime } from "@/components/tools/ToolRuntime";
import { isImplemented } from "@/content/tools/implemented";
import { CtaSection } from "@/components/sections/CtaSection";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";
import { toolsUi } from "@/content/tools/ui";
import { categories, getCategory, isCategoryId } from "@/content/tools/categories";
import { getTool } from "@/content/tools/registry";
import { liveTools, toolsInCategory } from "@/lib/tools";
import { breadcrumbJsonLd, toolJsonLd } from "@/lib/tools/seo";
import { buildMetadata, compactTitle, faqJsonLd, itemListJsonLd } from "@/lib/seo";
import { site } from "@/content/site";
import { locales, t, type Locale } from "@/lib/i18n";

/**
 * Segment unique résolvant DEUX types de page : une catégorie
 * (/tools/images) ou un outil (/tools/password-generator).
 *
 * tools.md place les deux au même niveau d'URL, or Next.js n'autorise pas
 * deux segments dynamiques frères. On résout donc ici, et le contrôle
 * d'intégrité du registry garantit qu'aucun slug d'outil ne peut porter le
 * nom d'une catégorie.
 */
export function generateStaticParams() {
  const segments = [
    ...categories.map((category) => category.id),
    // Seuls les outils construits obtiennent une URL.
    ...liveTools.map((tool) => tool.slug),
  ];

  // Un outil déclaré live sans interface produirait une page vide.
  for (const tool of liveTools) {
    if (!isImplemented(tool.slug)) {
      throw new Error(
        `L'outil « ${tool.slug} » est marqué live mais n'a pas d'interface — voir content/tools/implemented.ts`,
      );
    }
  }

  return locales.flatMap((locale) => segments.map((segment) => ({ locale, segment })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; segment: string }>;
}): Promise<Metadata> {
  const { locale, segment } = await params;

  if (isCategoryId(segment)) {
    const category = getCategory(segment);
    if (!category) return {};
    return buildMetadata({
      locale,
      segment: `tools/${segment}`,
      title: `${t(category.name, locale)} ${t(toolsUi.navLabel, locale).toLowerCase()}`,
      // La description de catégorie seule tombait sous 70 caractères. Le
      // décompte réel la complète et informe avant le clic.
      description: (() => {
        const live = toolsInCategory(category.id, true).length;
        // « 0 tools » se lit comme une erreur. Une catégorie encore vide le dit
        // franchement et renvoie vers ce qui existe.
        const suffix = live
          ? t(toolsUi.categoryMetaFilled, locale).replace("{n}", String(live))
          : t(toolsUi.categoryMetaEmpty, locale);
        return `${t(category.description, locale)} ${suffix}`;
      })(),
    });
  }

  const tool = getTool(segment);
  if (!tool) return {};
  return buildMetadata({
    locale,
    segment: `tools/${segment}`,
    // Titre exact, sans suffixe de site : sur une page d'outil, c'est le nom
    // qui porte l'intention de recherche et il ne doit jamais être tronqué.
    title: compactTitle(tool.name, t(tool.tagline, locale)),
    exactTitle: true,
    description: t(tool.description, locale),
  });
}

export default async function ToolSegmentPage({
  params,
}: {
  params: Promise<{ locale: Locale; segment: string }>;
}) {
  const { locale, segment } = await params;

  if (isCategoryId(segment)) return <CategoryPage id={segment} locale={locale} />;

  const tool = getTool(segment);
  if (!tool || tool.status !== "live") notFound();

  if (!isImplemented(tool.slug)) notFound();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(tool, locale)} />
      <JsonLd data={toolJsonLd(tool, locale)} />
      {/* FAQPage seulement si ToolShell affiche réellement la FAQ. */}
      {tool.faq?.length ? (
        <JsonLd
          data={faqJsonLd(
            tool.faq.map((item) => ({ question: t(item.q, locale), answer: t(item.a, locale) })),
          )}
        />
      ) : null}
      <ToolShell tool={tool} locale={locale}>
        <ToolRuntime slug={tool.slug} locale={locale} />
      </ToolShell>
    </>
  );
}

function CategoryPage({ id, locale }: { id: string; locale: Locale }) {
  const category = getCategory(id);
  if (!category) notFound();
  const list = toolsInCategory(category.id);

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          list
            .filter((tool) => tool.status === "live")
            .map((tool) => ({
              name: tool.name,
              url: `${site.url}/${locale}/tools/${tool.slug}/`,
              description: t(tool.tagline, locale),
            })),
          `${t(category.name, locale)} — ${t(toolsUi.navLabel, locale)}`,
        )}
      />
      <Section labelledBy="category-title">
        <Reveal delay={revealDelay.title}>
          <div className="mb-12 flex flex-col items-start gap-3">
            <Badge>
              <ToolIcon name={category.icon} size={15} />
              {t(toolsUi.navLabel, locale)}
            </Badge>
            <h1 id="category-title" className="t-h1 balanced">
              {t(category.name, locale)}
            </h1>
            <p className="t-body-lg max-w-[520px]">{t(category.description, locale)}</p>
          </div>
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((tool) => (
            <li key={tool.slug}>
              <ToolCard tool={tool} locale={locale} />
            </li>
          ))}
        </ul>
      </Section>
      <CtaSection locale={locale} />
    </>
  );
}
