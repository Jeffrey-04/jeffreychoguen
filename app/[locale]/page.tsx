import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Pillars } from "@/components/sections/Pillars";
import { WhyChooseMe } from "@/components/sections/WhyChooseMe";
import { Process } from "@/components/sections/Process";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { CtaSection } from "@/components/sections/CtaSection";
import { Accordion } from "@/components/ui/Accordion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon";
import { faq, sections, ui } from "@/content/dictionary";
import { featuredProjects } from "@/content/projects";
import { site } from "@/content/site";
import { buildMetadata, faqJsonLd, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { locales, path, t, type Locale } from "@/lib/i18n";

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
    title: `${site.name} — ${t(site.jobTitle, locale)}`,
    description: t(site.tagline, locale),
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLd data={websiteJsonLd(locale)} />
      {/* La FAQ est réellement rendue plus bas : le balisage est légitime. */}
      <JsonLd
        data={faqJsonLd(faq.map((item) => ({ question: t(item.q, locale), answer: t(item.a, locale) })))}
      />
      <Hero locale={locale} />
      <Marquee label={locale === "fr" ? "Technologies" : "Technologies"} />
      <Pillars locale={locale} />

      <Section labelledBy="projects-title">
        <SectionHeader
          id="projects-title"
          badge={t(sections.projects.badge, locale)}
          title={t(sections.projects.title, locale)}
          description={t(sections.projects.description, locale)}
        />
        <ProjectGrid locale={locale} items={featuredProjects} />
        <div className="mt-10 flex justify-center">
          <ButtonLink href={path(locale, "projects")} variant="inverse" className="rounded-full">
            {t(ui.allProjects, locale)}
            <ArrowUpRight size={16} />
          </ButtonLink>
        </div>
      </Section>

      <WhyChooseMe locale={locale} />

      <Process locale={locale} />

      <Section labelledBy="skills-title">
        <SectionHeader
          id="skills-title"
          badge={t(sections.skills.badge, locale)}
          title={t(sections.skills.title, locale)}
          description={t(sections.skills.description, locale)}
        />
        <SkillsGrid locale={locale} />
      </Section>

      <Section labelledBy="faq-title">
        <SectionHeader
          id="faq-title"
          badge={t(sections.faq.badge, locale)}
          title={t(sections.faq.title, locale)}
          description={t(sections.faq.description, locale)}
        />
        <Accordion items={faq.map((item) => ({ question: t(item.q, locale), answer: t(item.a, locale) }))} />
      </Section>

      <CtaSection locale={locale} />
    </>
  );
}
