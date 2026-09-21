import { Card } from "@/components/ui/Card";
import { IconChip } from "@/components/ui/IconChip";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay, staggerDelay } from "@/components/motion/motion";
import { skillGroups } from "@/content/skills";
import { type Locale, t } from "@/lib/i18n";

/**
 * design.md §6.1 #8 — grille irrégulière, une seule carte sombre en accent.
 *
 * Anatomie reprise de la référence : la pastille d'icône occupe le haut, un
 * espace souple la sépare du texte, et titre puis description se posent EN BAS
 * de la carte. Le bloc de texte est donc ancré au bas : une carte plus fournie
 * en étiquettes remonte son titre d'autant. C'est voulu — le regard suit le
 * bas des cartes, pas leur milieu.
 */
export function SkillsGrid({ locale }: { locale: Locale }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((group, index) => (
        <Reveal
          as="li"
          key={group.id}
          delay={staggerDelay(index % 3, revealDelay.cards)}
          className={group.featured ? "md:col-span-2" : ""}
        >
          <Card className={`h-full ${group.featured ? "card-dark" : ""}`} dark={group.featured} interactive>
            <div className="flex h-full min-h-[300px] flex-col p-7">
              <IconChip name={group.icon} dark={group.featured} />

              {/* Pousse le texte vers le bas — l'espace est structurel. */}
              <div className="flex-1" aria-hidden="true" />

              <h3 className={`t-h3 ${group.featured ? "text-white" : ""}`}>
                {t(group.title, locale)}
              </h3>
              <p className={`t-body mt-1.5 ${group.featured ? "text-white/70" : ""}`}>
                {t(group.description, locale)}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={`rounded-full border px-3 py-1 text-[13px] leading-5 ${
                      group.featured
                        ? "border-white/20 text-white/80"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Reveal>
      ))}
    </ul>
  );
}
