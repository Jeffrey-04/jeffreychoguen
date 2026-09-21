import { techLogos } from "@/content/tech-logos";

/**
 * design.md §5.9 — logos défilants sous le hero, gap 64px, logos 24px de haut,
 * boucle infinie lente. Technologies plutôt que logos clients.
 *
 * Aucun fond ni filet : les marques reposent directement sur les hachures de
 * la page. Une bande blanche créait une rupture horizontale qui coupait le
 * hero du reste, là où le fond continu laisse la page respirer d'un bloc.
 *
 * Les logos sont des tracés SVG inline issus de simple-icons, auto-hébergés
 * (cf. scripts/generate-logos.mjs) : aucune requête réseau, teinte héritée via
 * currentColor pour rester dans la palette achromatique.
 *
 * La piste est dupliquée et l'animation translate de -50 %, ce qui donne une
 * boucle sans raccord visible. Le doublon est aria-hidden pour ne pas répéter
 * la liste aux lecteurs d'écran. Défilement arrêté sous prefers-reduced-motion.
 */
export function Marquee({ label }: { label: string }) {
  return (
    <section aria-label={label} className="overflow-hidden py-9">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-16">
            {techLogos.map((logo) => (
              <li key={`${copy}-${logo.slug}`} className="flex shrink-0 items-center gap-3 text-gray-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path d={logo.path} />
                </svg>
                <span className="whitespace-nowrap text-[18px] font-medium leading-7 tracking-[-0.02em]">
                  {logo.title}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
