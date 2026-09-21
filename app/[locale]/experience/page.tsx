import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { CtaSection } from "@/components/sections/CtaSection";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay, staggerDelay } from "@/components/motion/motion";
import { ArrowUpRight } from "@/components/ui/Icon";
import { education, engagementLabels, experiences } from "@/content/experience";
import { sections, ui } from "@/content/dictionary";
import { languages } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { locales, t, tList, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    segment: "experience",
    title: t(sections.experience.title, locale),
    description: t(sections.experience.description, locale),
  });
}

export default async function ExperiencePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <Section labelledBy="experience-title">
        <Reveal delay={revealDelay.title}>
          <div className="mb-16 flex flex-col items-start gap-3">
            <Badge>{t(sections.experience.badge, locale)}</Badge>
            <h1 id="experience-title" className="t-h1 balanced max-w-[720px]">
              {t(sections.experience.title, locale)}
            </h1>
            <p className="t-body-lg max-w-[560px]">{t(sections.experience.description, locale)}</p>
          </div>
        </Reveal>

        <ol className="flex flex-col gap-4">
          {experiences.map((job, index) => (
            <Reveal as="li" key={job.slug} delay={staggerDelay(index, revealDelay.cards)}>
              <Card>
                <CardBody className="gap-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <div>
                      <h2 className="t-h3">{t(job.role, locale)}</h2>
                      <p className="t-body">{job.company}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <span className="t-meta">
                        {job.start} — {job.end ?? t(ui.present, locale)}
                      </span>
                      {/* Nature de l'engagement : quatre rôles se chevauchent en 2025. */}
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[13px] leading-5 text-gray-600">
                        {t(engagementLabels[job.engagement], locale)}
                      </span>
                    </div>
                  </div>

                  <p className="t-body">{t(job.summary, locale)}</p>

                  <ul className="flex list-disc flex-col gap-2 pl-5">
                    {tList(job.highlights, locale).map((line) => (
                      <li key={line} className="t-body">{line}</li>
                    ))}
                  </ul>

                  <ul className="mt-2 flex flex-wrap gap-2">
                    {job.stack.map((tech) => (
                      <li key={tech} className="rounded-full border border-gray-200 px-3 py-1 text-[13px] leading-5 text-gray-600">
                        {tech}
                      </li>
                    ))}
                  </ul>

                  {job.links?.length ? (
                    <ul className="mt-2 flex flex-wrap gap-4">
                      {job.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="t-body-sm inline-flex items-center gap-1 text-gray-900 underline underline-offset-4"
                          >
                            {link.label}
                            <ArrowUpRight size={14} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section labelledBy="education-title">
        <h2 id="education-title" className="t-h2 mb-8">{t(ui.education, locale)}</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {education.map((item) => (
            <Reveal as="li" key={`${item.school}-${item.end}`} delay={revealDelay.cards}>
              <Card className="h-full">
                <CardBody>
                  <h3 className="t-h5">{t(item.degree, locale)}</h3>
                  <p className="t-body">{item.school}</p>
                  <p className="t-meta">{item.start} — {item.end}</p>
                  {item.distinction ? (
                    <p className="mt-2 inline-flex w-fit rounded-full border border-accent-500 bg-accent-200 px-3 py-1 text-[13px] leading-5 text-gray-900">
                      {t(item.distinction, locale)}
                    </p>
                  ) : null}
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </ul>

        <h2 className="t-h2 mb-6 mt-16">{t(ui.languagesSpoken, locale)}</h2>
        <ul className="flex flex-wrap gap-3">
          {languages.map((lang) => (
            <li key={lang.name.en} className="rounded-full border border-gray-200 bg-white px-4 py-2 t-body-sm">
              <strong className="text-gray-900">{t(lang.name, locale)}</strong> · {t(lang.level, locale)}
            </li>
          ))}
        </ul>
      </Section>

      <CtaSection locale={locale} />
    </>
  );
}
