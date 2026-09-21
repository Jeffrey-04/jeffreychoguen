import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolCard } from "@/components/tools/ToolCard";
import { CtaSection } from "@/components/sections/CtaSection";
import { toolsUi } from "@/content/tools/ui";
import { getCategory } from "@/content/tools/categories";
import type { ToolDefinition } from "@/content/tools/registry";
import { relatedFor } from "@/lib/tools";
import { type Locale, path, t } from "@/lib/i18n";

/**
 * Enveloppe commune à toutes les pages outil (tools.md §16).
 *
 * L'ordre des blocs est le même partout : fil d'Ariane, titre, badge de
 * confidentialité, carte de l'outil, mode d'emploi, FAQ, outils liés. C'est
 * cette constance qui fait qu'un visiteur arrivé sur un outil sait déjà se
 * repérer sur les 20 autres.
 */
export function ToolShell({
  tool,
  locale,
  children,
  howItWorks,
}: {
  tool: ToolDefinition;
  locale: Locale;
  children: ReactNode;
  howItWorks?: ReactNode;
}) {
  const category = getCategory(tool.category);
  const related = relatedFor(tool);

  return (
    <>
      <Section>
        <Reveal delay={revealDelay.title}>
          {/* Fil d'Ariane : navigation réelle, doublée du schema dans la page. */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 t-meta">
              <li>
                <Link href={path(locale, "tools")} className="hover:text-gray-900">
                  {t(toolsUi.navLabel, locale)}
                </Link>
              </li>
              {category ? (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={path(locale, `tools/${category.id}`)}
                      className="hover:text-gray-900"
                    >
                      {t(category.name, locale)}
                    </Link>
                  </li>
                </>
              ) : null}
              <li aria-hidden="true">/</li>
              <li className="text-gray-900">{tool.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col items-start gap-4">
            {category ? <Badge>{t(category.name, locale)}</Badge> : null}
            <h1 className="t-h1 balanced max-w-[760px]">{tool.name}</h1>
            <p className="t-body-lg max-w-[560px]">{t(tool.description, locale)}</p>
            <PrivacyBadge processing={tool.processing} locale={locale} />
          </div>
        </Reveal>

        {/* Carte principale de l'outil */}
        <Reveal delay={revealDelay.content} className="mt-10">
          <Card>
            <div className="p-6 md:p-10">{children}</div>
          </Card>
        </Reveal>

        {howItWorks ? (
          <Reveal delay={revealDelay.cards} className="mt-12">
            <div className="max-w-[720px]">
              <h2 className="t-h3 mb-4">{t(toolsUi.howItWorks, locale)}</h2>
              <div className="t-body flex flex-col gap-3">{howItWorks}</div>
            </div>
          </Reveal>
        ) : null}
      </Section>

      {tool.faq?.length ? (
        <Section labelledBy="tool-faq">
          <h2 id="tool-faq" className="t-h2 mb-10 text-center">
            {t(toolsUi.faqTitle, locale)}
          </h2>
          <Accordion
            items={tool.faq.map((item) => ({
              question: t(item.q, locale),
              answer: t(item.a, locale),
            }))}
          />
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section labelledBy="tool-related">
          <h2 id="tool-related" className="t-h3 mb-6">
            {t(toolsUi.relatedTitle, locale)}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <ToolCard tool={item} locale={locale} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaSection locale={locale} />
    </>
  );
}
