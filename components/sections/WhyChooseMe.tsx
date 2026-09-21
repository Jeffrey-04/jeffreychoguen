import { Badge, AvailabilityDot } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { stackDelays } from "@/components/motion/motion";
import { sections, ui, whyMeCards } from "@/content/dictionary";
import { techLogos } from "@/content/tech-logos";
import { type Locale, t } from "@/lib/i18n";

/**
 * design.md §6.1 #5 — header en deux colonnes, puis mosaïque : deux cartes
 * empilées à gauche, deux au centre, une grande carte sombre à droite.
 *
 * Les cinq cartes s'empilent à l'arrivée et se désempilent à l'envers au
 * retour (cf. stackDelays). L'ordre d'index ci-dessous EST l'ordre d'entrée :
 * le changer change l'animation.
 */
const COUNT = 5;

export function WhyChooseMe({ locale }: { locale: Locale }) {
  const big = "font-display text-[44px] leading-none tracking-[-0.02em] text-gray-900";

  return (
    <section className="section-pad" aria-labelledby="why-title">
      <div className="container-page">
        <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-start">
          <Reveal {...stackDelays(0, COUNT)}>
            <div className="flex flex-col items-start gap-3">
              <Badge>{t(sections.whyMe.badge, locale)}</Badge>
              <h2 id="why-title" className="t-h2 balanced max-w-[420px]">
                {t(sections.whyMe.title, locale)}
              </h2>
            </div>
          </Reveal>
          <Reveal {...stackDelays(1, COUNT)}>
            <p className="t-body-lg balanced lg:pt-10">{t(sections.whyMe.description, locale)}</p>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Colonne 1 */}
          <div className="flex flex-col gap-4">
            <Reveal {...stackDelays(0, COUNT)}>
              <Card className="flex items-center gap-4 p-6">
                {/* Équivalent honnête des avatars clients du template : les
                    technologies réellement en production, pas des visages
                    de banque d'images sous licence. */}
                <ul className="flex shrink-0 items-center" aria-hidden="true">
                  {techLogos.slice(0, 4).map((logo, i) => (
                    <li
                      key={logo.slug}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
                      style={{ marginLeft: i === 0 ? 0 : -14, zIndex: 4 - i }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d={logo.path} />
                      </svg>
                    </li>
                  ))}
                </ul>
                <p className="t-h6">
                  {whyMeCards.stack.value} {t(whyMeCards.stack.label, locale)}
                </p>
              </Card>
            </Reveal>

            <Reveal {...stackDelays(1, COUNT)} className="flex-1">
              <Card className="flex h-full flex-col justify-between gap-10 p-6">
                <p className="t-body">{t(whyMeCards.roles.text, locale)}</p>
                <div>
                  <p className={big}>{whyMeCards.roles.value}</p>
                  <p className="t-meta mt-1">{t(whyMeCards.roles.label, locale)}</p>
                </div>
              </Card>
            </Reveal>
          </div>

          {/* Colonne 2 */}
          <div className="flex flex-col gap-4">
            <Reveal {...stackDelays(2, COUNT)} className="flex-1">
              <Card className="flex h-full flex-col justify-between gap-10 p-6">
                <p className="t-body">{t(whyMeCards.ecosystems.text, locale)}</p>
                <div>
                  <p className={big}>{whyMeCards.ecosystems.value}</p>
                  <p className="t-meta mt-1">{t(whyMeCards.ecosystems.label, locale)}</p>
                </div>
              </Card>
            </Reveal>

            <Reveal {...stackDelays(3, COUNT)}>
              <Card className="flex items-center gap-3 p-6">
                <AvailabilityDot />
                <p className="t-h6">{t(ui.available, locale)}</p>
              </Card>
            </Reveal>
          </div>

          {/* Colonne 3 — carte sombre, unique accent de la grille */}
          <Reveal {...stackDelays(4, COUNT)} className="md:col-span-2 lg:col-span-1">
            <Card dark className="flex h-full flex-col justify-between gap-12 p-8">
              <p className="text-[18px] leading-7 text-white/75">
                {t(whyMeCards.dark.text, locale)}
              </p>
              <div>
                <p className="font-display text-[44px] leading-none tracking-[-0.02em] text-white">
                  {whyMeCards.dark.value}
                </p>
                <p className="mt-1 text-[14px] leading-5 text-white/60">
                  {t(whyMeCards.dark.label, locale)}
                </p>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
