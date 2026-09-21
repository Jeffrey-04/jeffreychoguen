import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { IconChip } from "@/components/ui/IconChip";
import { Section } from "@/components/ui/Section";
import { CtaSection } from "@/components/sections/CtaSection";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";
import { experiences } from "@/content/experience";
import { site } from "@/content/site";
import { buildMetadata, compactTitle } from "@/lib/seo";
import { locales, t, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const copy = {
  badge: { en: "About me", fr: "À propos" },
  title: {
    en: "I build the parts of a product people never see",
    fr: "Je construis la partie des produits qu'on ne voit jamais",
  },
  intro: {
    en: "I am a full stack software engineer based in Yaoundé, Cameroon. I work mostly on backends — the APIs, data models and infrastructure that everything else depends on — and I stay responsible for what I ship after it goes live.",
    fr: "Je suis ingénieur logiciel full stack, basé à Yaoundé, au Cameroun. Je travaille surtout sur les backends — les API, modèles de données et infrastructures dont tout le reste dépend — et je reste responsable de ce que je livre après la mise en ligne.",
  },
  story: {
    en: [
      "I started in 2019 as a junior developer at Orelex Tech, writing modules inside applications larger than anything I had built before, and testing code written by people more experienced than me.",
      "In parallel I studied management computing at ISTAG, where I finished top of my class for the professional bachelor's degree and second nationally for the technician's certificate. That training left me with a habit I have never dropped: modelling a domain formally before writing code.",
      "In 2023 I co-founded AfreeLink and took the CTO role — architecture, implementation and production for a pan-African freelance platform. Since 2025 I have also been Lead Backend Developer at Colisgo, where I designed a backend serving a mobile app, a web platform and an admin dashboard at once.",
    ],
    fr: [
      "J'ai commencé en 2019 comme développeur junior chez Orelex Tech, à écrire des modules dans des applications plus grandes que tout ce que j'avais construit jusque-là, et à tester le code de personnes plus expérimentées que moi.",
      "En parallèle, j'ai étudié l'informatique de gestion à l'ISTAG, où j'ai terminé major de promotion en licence professionnelle et vice-major national en BTS. Cette formation m'a laissé une habitude que je n'ai jamais abandonnée : modéliser formellement un domaine avant d'écrire du code.",
      "En 2023, j'ai co-fondé AfreeLink et pris le rôle de CTO — architecture, réalisation et production d'une plateforme freelance panafricaine. Depuis 2025, je suis aussi Lead Backend Developer chez Colisgo, où j'ai conçu un backend desservant à la fois une application mobile, une plateforme web et un tableau de bord d'administration.",
    ],
  },
  timelineTitle: { en: "How it progressed", fr: "La progression" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    segment: "about",
    title: compactTitle(site.name, t(copy.title, locale)),
    exactTitle: true,
    description: t(copy.intro, locale),
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  /** Timeline réelle, dans l'ordre chronologique du CV. */
  const timeline = [...experiences].reverse();

  return (
    <>
      <Section labelledBy="about-title">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal delay={revealDelay.title}>
            <div className="flex flex-col items-start gap-4">
              <Badge>{t(copy.badge, locale)}</Badge>
              <h1 id="about-title" className="t-h1 balanced">{t(copy.title, locale)}</h1>
              <p className="t-body-lg max-w-[560px]">{t(copy.intro, locale)}</p>
            </div>
          </Reveal>
          <Reveal delay={revealDelay.visual}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-gray-200">
              <Image
                src="/assets/hero.webp"
                alt={`${site.name}, ${t(site.jobTitle, locale)}`}
                fill
                sizes="(max-width: 810px) 100vw, 460px"
                className="object-cover object-top grayscale"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal delay={revealDelay.content}>
            <div className="flex flex-col gap-5">
              {copy.story[locale].map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="t-body-lg">{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={revealDelay.cards}>
            <Card>
              <CardBody className="gap-5">
                {/* Même pastille en relief que les cartes de compétences :
                    une seule grammaire visuelle sur tout le site. */}
                <IconChip name="process" />
                <h2 className="t-h3">{t(copy.timelineTitle, locale)}</h2>
                <ol className="flex flex-col gap-4">
                  {timeline.map((job) => (
                    <li key={job.slug} className="flex gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <span className="t-meta w-[92px] shrink-0">
                        {job.start}{job.end ? `–${job.end}` : "–"}
                      </span>
                      <div>
                        <p className="t-h6">{t(job.role, locale)}</p>
                        <p className="t-body-sm">{job.company}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardBody>
            </Card>
          </Reveal>
        </div>
      </Section>

      <CtaSection locale={locale} />
    </>
  );
}
