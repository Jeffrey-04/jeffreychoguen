"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { PhosphorIcon } from "@/components/ui/PhosphorIcon";
import { processSteps, sections } from "@/content/dictionary";
import type { IconName } from "@/content/phosphor-icons";
import { type Locale, t } from "@/lib/i18n";

/**
 * design.md §5.8 + §7.5 — timeline verticale.
 *
 * Une étape ATTEINTE devient une carte blanche bordée ; les étapes à venir
 * restent nues sur le fond, en teinte atténuée. Le trait vertical passe
 * derrière les cartes, à l'aplomb des icônes, et se remplit à mesure que la
 * liste traverse le centre du viewport.
 */
/**
 * Bornes de la course de scrub, en fraction de la hauteur du viewport.
 *
 * C'est ICI que se règle la vitesse de la séquence. Auparavant la progression
 * se jouait sur la seule hauteur de la liste : les six étapes défilaient en
 * quelques centaines de pixels. En démarrant quand la liste entre par le bas
 * et en finissant quand elle atteint le haut, on étale la même séquence sur
 * environ deux fois plus de scroll — chaque étape a le temps de s'installer.
 *
 * Écarter les deux valeurs ralentit encore ; les rapprocher accélère.
 */
const SCRUB_START = 0.95;
const SCRUB_END = 0.3;

export function Process({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    let frame = 0;
    let target = 0;
    let current = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = vh * SCRUB_START;
      const travel = rect.height + vh * (SCRUB_START - SCRUB_END);
      target = Math.min(1, Math.max(0, (from - rect.top) / travel));
    };

    /*
     * Interpolation vers la cible plutôt que suivi direct du scroll : lier une
     * barre au pixel près reproduit les à-coups du trackpad. Ce rattrapage
     * suit le geste sans le copier.
     */
    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.001) current = target;
      setProgress(current);
      frame = Math.abs(target - current) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    measure();
    current = target;
    setProgress(current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /** Une étape est atteinte quand le remplissage dépasse son milieu. */
  const reached = (index: number) => progress >= (index + 0.5) / processSteps.length;

  return (
    <section className="section-pad" aria-labelledby="process-title">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.25fr]">
        <div className="flex flex-col items-start gap-3 lg:sticky lg:top-24 lg:self-start">
          <Badge>
            <PhosphorIcon name="process" size={15} />
            {t(sections.process.badge, locale)}
          </Badge>
          <h2 id="process-title" className="t-h2 balanced max-w-[420px]">
            {t(sections.process.title, locale)}
          </h2>
          <p className="t-body-lg balanced max-w-[400px]">
            {t(sections.process.description, locale)}
          </p>
        </div>

        {/*
          Trois plans, du fond vers l'avant : les cartes, puis le trait, puis
          les pastilles. Le trait passe AU-DESSUS des cartes, comme dans la
          référence — il relie les étapes au lieu de disparaître sous elles.

          isolate crée un contexte d'empilement propre à la liste : les
          z-index ci-dessous restent confinés ici et ne peuvent pas passer
          devant la navigation flottante.
        */}
        <ol ref={ref} className="relative isolate">
          {/* Trait vertical, à l'aplomb du centre des icônes (36px). */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-9 top-6 z-[1] w-0.5 -translate-x-1/2 overflow-hidden rounded-full bg-gray-200"
          >
            <div
              className="w-full rounded-full bg-gray-900"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          {processSteps.map((step, index) => {
            const isReached = reached(index);
            return (
              <li key={step.title.en} className="relative pb-3 last:pb-0">
                <div
                  className={`relative flex gap-5 rounded-[16px] p-6 pl-[72px] transition-colors duration-500 ${
                    isReached ? "border border-gray-200 bg-white" : "border border-transparent"
                  }`}
                >
                  <span
                    className={`absolute left-4 top-6 z-[2] flex h-10 w-10 items-center justify-center rounded-full border transition-[background-color,border-color,color,box-shadow] duration-500 ${
                      isReached
                        ? "border-gray-200 bg-white text-gray-900 shadow-[0_6px_16px_-4px_rgba(18,18,24,0.18)]"
                        : "border-transparent bg-gray-100 text-gray-400"
                    }`}
                  >
                    <PhosphorIcon name={step.icon as IconName} size={20} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3
                      className={`t-h4 transition-colors duration-500 ${
                        isReached ? "" : "text-gray-500"
                      }`}
                    >
                      {t(step.title, locale)}
                    </h3>
                    <p
                      // gray-500 et non gray-400 : une étape à venir reste du
                      // texte informatif, il doit rester lisible (design.md §9).
                      className={`t-body transition-colors duration-500 ${
                        isReached ? "" : "text-gray-500"
                      }`}
                    >
                      {t(step.description, locale)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
