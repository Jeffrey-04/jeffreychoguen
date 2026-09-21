import { Card } from "@/components/ui/Card";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay, staggerDelay } from "@/components/motion/motion";
import { LottiePlayer } from "@/components/motion/LottiePlayer";
import { pillars, sections } from "@/content/dictionary";
import { type Locale, t } from "@/lib/i18n";

/**
 * design.md §6.1 #3 — header centré puis trois cartes blanches.
 *
 * La zone visuelle porte une animation Lottie plutôt que le numéro décoratif
 * qui l'occupait. Le fichier est nommé d'après le pilier, sauf « devops » dont
 * l'animation s'appelle delivery — d'où cette table explicite : une déduction
 * depuis l'identifiant casserait silencieusement au prochain renommage.
 */
const ANIMATION: Record<string, string> = {
  backend: "/assets/lottie/backend.json",
  mobile: "/assets/lottie/mobile.json",
  devops: "/assets/lottie/delivery.json",
};

export function Pillars({ locale }: { locale: Locale }) {
  return (
    <Section labelledBy="pillars-title">
      <SectionHeader
        id="pillars-title"
        badge={t(sections.approach.badge, locale)}
        title={t(sections.approach.title, locale)}
        description={t(sections.approach.description, locale)}
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <Reveal as="li" key={pillar.id} delay={staggerDelay(index, revealDelay.cards)}>
            <Card className="flex h-full flex-col overflow-hidden" interactive>
              <div className="relative h-[258px] shrink-0 overflow-hidden bg-gray-50">
                <div aria-hidden="true" className="absolute inset-0 bg-hatch" />
                {/* Le dégradé fond l'animation dans la carte : sans lui, le
                    carré du rendu Lottie se découpe sur les hachures. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-white"
                />
                <LottiePlayer
                  src={ANIMATION[pillar.id]}
                  className="absolute inset-0 flex items-center justify-center [&_svg]:max-h-full [&_svg]:max-w-full"
                />
              </div>
              <div className="flex flex-col gap-2 p-8">
                <h3 className="t-h3">{t(pillar.title, locale)}</h3>
                <p className="t-body">{t(pillar.description, locale)}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
