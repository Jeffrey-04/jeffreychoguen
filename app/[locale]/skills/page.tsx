import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { CtaSection } from "@/components/sections/CtaSection";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";
import { sections } from "@/content/dictionary";
import { additionalKnowledge } from "@/content/skills";
import { buildMetadata } from "@/lib/seo";
import { locales, t, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    segment: "skills",
    title: t(sections.skills.title, locale),
    description: t(sections.skills.description, locale),
  });
}

export default async function SkillsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <Section labelledBy="skills-title">
        <Reveal delay={revealDelay.title}>
          <div className="mb-16 flex flex-col items-start gap-3">
            <Badge>{t(sections.skills.badge, locale)}</Badge>
            <h1 id="skills-title" className="t-h1 balanced max-w-[720px]">
              {t(sections.skills.title, locale)}
            </h1>
            <p className="t-body-lg max-w-[560px]">{t(sections.skills.description, locale)}</p>
          </div>
        </Reveal>
        <SkillsGrid locale={locale} />

        <Reveal delay={revealDelay.content} className="mt-4">
          <Card>
            <CardBody>
              <h2 className="t-h4">{t(additionalKnowledge.title, locale)}</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {additionalKnowledge.items.map((item) => (
                  <li key={item} className="rounded-full border border-gray-200 px-3 py-1 text-[13px] leading-5 text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Reveal>
      </Section>
      <CtaSection locale={locale} />
    </>
  );
}
