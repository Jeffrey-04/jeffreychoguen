import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { CtaSection } from "@/components/sections/CtaSection";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";
import { Download } from "@/components/ui/Icon";
import { education, engagementLabels, experiences } from "@/content/experience";
import { ui } from "@/content/dictionary";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";
import { buildMetadata } from "@/lib/seo";
import { locales, t, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const copy = {
  badge: { en: "CV", fr: "CV" },
  title: { en: "Curriculum vitae", fr: "Curriculum vitæ" },
  intro: {
    en: "The full record: roles, education and the technologies behind them. The PDF mirrors this page.",
    fr: "Le parcours complet : postes, formation et technologies associées. Le PDF reprend cette page.",
  },
  pdfMissing: {
    en: "The PDF is not published yet — everything it contains is on this page.",
    fr: "Le PDF n'est pas encore publié — tout ce qu'il contient figure sur cette page.",
  },
} as const;

/**
 * Un CV par langue. Le fichier anglais n'a rien à faire devant un recruteur
 * francophone, et inversement : le téléchargement suit la langue de la page.
 */
const PDF: Record<Locale, string> = {
  en: "CV-Jeffrey-en.pdf",
  fr: "CV-Jeffrey-fr.pdf",
};

function pdfFor(locale: Locale): string | null {
  const file = PDF[locale];
  return fs.existsSync(path.join(process.cwd(), "public", "cv", file)) ? file : null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    segment: "cv",
    title: `${t(copy.title, locale)} — ${site.name}`,
    description: t(copy.intro, locale),
  });
}

export default async function CvPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const pdf = pdfFor(locale);

  return (
    <>
      <Section labelledBy="cv-title">
        <Reveal delay={revealDelay.title}>
          <div className="mb-12 flex flex-col items-start gap-3">
            <Badge>{t(copy.badge, locale)}</Badge>
            <h1 id="cv-title" className="t-h1 balanced">{t(copy.title, locale)}</h1>
            <p className="t-body-lg max-w-[560px]">{t(copy.intro, locale)}</p>
            {pdf ? (
              <ButtonLink href={`/cv/${pdf}`} className="mt-4" external download={pdf}>
                {t(ui.downloadCv, locale)}
                <Download />
              </ButtonLink>
            ) : (
              <p className="t-meta mt-2">{t(copy.pdfMissing, locale)}</p>
            )}
          </div>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Reveal delay={revealDelay.content}>
            <Card>
              <CardBody className="gap-6 md:p-10">
                <h2 className="t-h3">{locale === "fr" ? "Expérience" : "Experience"}</h2>
                <ol className="flex flex-col gap-5">
                  {experiences.map((job) => (
                    <li key={job.slug} className="border-b border-gray-200 pb-5 last:border-0 last:pb-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="t-h6">{t(job.role, locale)} · {job.company}</h3>
                        <span className="t-meta">
                          {job.start} — {job.end ?? t(ui.present, locale)} · {t(engagementLabels[job.engagement], locale)}
                        </span>
                      </div>
                      <p className="t-body mt-1">{t(job.summary, locale)}</p>
                    </li>
                  ))}
                </ol>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal delay={revealDelay.cards}>
            <div className="flex flex-col gap-4">
              <Card>
                <CardBody className="gap-4">
                  <h2 className="t-h4">{t(ui.education, locale)}</h2>
                  <ul className="flex flex-col gap-3">
                    {education.map((item) => (
                      <li key={`${item.school}-${item.end}`}>
                        <p className="t-body-sm text-gray-900">{t(item.degree, locale)}</p>
                        <p className="t-meta">{item.school} · {item.start}–{item.end}</p>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="gap-4">
                  <h2 className="t-h4">{locale === "fr" ? "Compétences" : "Skills"}</h2>
                  {skillGroups.map((group) => (
                    <div key={group.id}>
                      <p className="t-body-sm text-gray-900">{t(group.title, locale)}</p>
                      <p className="t-meta">{group.items.join(", ")}</p>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>
      <CtaSection locale={locale} />
    </>
  );
}
