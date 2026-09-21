import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { CtaSection } from "@/components/sections/CtaSection";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";
import { sections } from "@/content/dictionary";
import { projects } from "@/content/projects";
import { buildMetadata } from "@/lib/seo";
import { locales, t, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    segment: "projects",
    title: t(sections.projects.title, locale),
    description: t(sections.projects.description, locale),
  });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <Section labelledBy="projects-title">
        <Reveal delay={revealDelay.title}>
          <div className="mb-16 flex flex-col items-start gap-3">
            <Badge>{t(sections.projects.badge, locale)}</Badge>
            <h1 id="projects-title" className="t-h1 balanced max-w-[720px]">
              {t(sections.projects.title, locale)}
            </h1>
            <p className="t-body-lg max-w-[520px]">{t(sections.projects.description, locale)}</p>
          </div>
        </Reveal>
        <ProjectGrid locale={locale} items={projects} />
      </Section>
      <CtaSection locale={locale} />
    </>
  );
}
