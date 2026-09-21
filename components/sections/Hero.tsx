import { ArrowUpRight, Download } from "@/components/ui/Icon";
import { AvailabilityDot } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";
import { heroMetrics } from "@/content/metrics";
import { ui } from "@/content/dictionary";
import { site } from "@/content/site";
import { type Locale, path, t } from "@/lib/i18n";

/**
 * design.md §6.1 #1 — bloc rayon 32px, dégradé 90deg gray-100 → gray-300,
 * colonne texte à gauche, portrait détouré ancré en bas à droite, carte
 * flottante « disponible ».
 *
 * Le portrait DÉBORDE au-dessus du cadre, comme dans la référence. Il est donc
 * frère de la carte (et non enfant), sinon overflow-hidden le couperait.
 *
 * Contrainte de l'asset : la source est un cadrage large (sujet 525x360, plus
 * large que haut) alors que la référence utilise un portrait vertical. Mis à
 * une hauteur suffisante pour déborder, il devient trop large et mange la
 * colonne de texte. Son bord gauche est donc fondu au masque : la silhouette
 * se dissout au lieu d'être coupée net.
 */
export function Hero({ locale }: { locale: Locale }) {
  const headline =
    locale === "fr"
      ? { lead: "Des systèmes", muted: "qui tiennent" }
      : { lead: "Systems built", muted: "to hold" };

  return (
    <section className="container-page pb-12 pt-10 lg:pt-20" aria-labelledby="hero-title">
      <div className="relative">
        {/* Cadre du hero */}
        <div className="overflow-hidden rounded-[32px] [background:linear-gradient(90deg,#EDEEF1_60%,#C9CDD2_100%)]">
          <div className="grid lg:h-[500px] lg:grid-cols-[1fr_46%]">
            <div className="flex flex-col justify-center gap-7 p-6 md:p-12 lg:py-12 lg:pl-[72px] lg:pr-8">
              <Reveal delay={revealDelay.title} y={32}>
                <div className="flex flex-col gap-5">
                  <h1
                    id="hero-title"
                    className="balanced font-display font-medium tracking-[-0.02em] text-[40px] leading-[42px] md:text-[52px] md:leading-[54px] lg:text-[56px] lg:leading-[60px]"
                  >
                    {headline.lead} <span className="text-gray-500">{headline.muted}</span>
                  </h1>
                  <p className="t-body-lg max-w-[440px]">{t(site.tagline, locale)}</p>
                </div>
              </Reveal>

              <Reveal delay={revealDelay.actions} y={32}>
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href={path(locale, "projects")}>
                    {t(ui.viewMyWork, locale)}
                    <ArrowUpRight />
                  </ButtonLink>
                  {/* Le libellé promet un téléchargement : il en déclenche un,
                      dans la langue de la page. La page /cv reste accessible
                      depuis le pied de page et le sitemap. */}
                  <ButtonLink
                    href={`/cv/CV-Jeffrey-${locale}.pdf`}
                    variant="secondary"
                    external
                    download={`CV-Jeffrey-${locale}.pdf`}
                  >
                    {t(ui.downloadCv, locale)}
                    <Download />
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={revealDelay.cards} y={32}>
                <dl className="grid grid-cols-3 gap-6">
                  {heroMetrics.map((metric) => (
                    <div key={metric.label.en} className="flex flex-col gap-1">
                      <dt className="sr-only">{t(metric.label, locale)}</dt>
                      <dd className="font-display text-[40px] font-medium leading-none tracking-[-0.02em] text-gray-900">
                        {metric.value}
                      </dd>
                      <p className="t-meta">{t(metric.label, locale)}</p>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            {/* Sous lg, le portrait vit dans le flux : en absolu, il se calerait
                sur la hauteur de la carte empilée et deviendrait démesuré.
                Au-dessus de lg, ce bloc ne fait que réserver la place. */}
            <div className="relative h-[300px] sm:h-[360px] lg:h-auto">
              <picture>
                <source srcSet="/assets/hero-cutout.avif" type="image/avif" />
                <img
                  src="/assets/hero-cutout.webp"
                  alt=""
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 h-full w-auto max-w-none object-contain grayscale lg:hidden"
                />
              </picture>
            </div>
          </div>
        </div>

        {/* Portrait détouré, débordant au-dessus du cadre. */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 hidden overflow-hidden rounded-br-[32px] lg:block lg:h-[calc(100%+44px)] lg:w-[46%]"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, #000 26%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 26%)",
          }}
        >
          <picture>
            <source srcSet="/assets/hero-cutout.avif" type="image/avif" />
            <img
              src="/assets/hero-cutout.webp"
              alt={`${site.name}, ${t(site.jobTitle, locale)}`}
              fetchPriority="high"
              decoding="async"
              className="absolute bottom-0 right-[-76px] h-full w-auto max-w-none object-contain grayscale"
            />
          </picture>
        </div>

        {/* Carte flottante « disponible », avec le bouton flèche de la référence. */}
        <Reveal
          delay={revealDelay.decor}
          y={32}
          className="absolute bottom-5 left-5 right-5 lg:left-auto lg:w-[356px]"
        >
          <div className="flex items-center gap-4 rounded-[16px] border border-white/30 bg-gray-900/40 p-6 backdrop-blur-md">
            <div className="min-w-0 flex-1">
              <p className="mb-1 flex items-center gap-2 text-[13px] leading-5 text-white/70">
                <AvailabilityDot />
                {locale === "fr" ? "Statut" : "Status"}
              </p>
              <p className="mb-1.5 text-[18px] font-medium leading-7 text-white">
                {t(ui.available, locale)}
              </p>
              <p className="text-[14px] leading-5 text-white/70">{t(ui.availableDetail, locale)}</p>
            </div>
            <a
              href={path(locale, "contact")}
              aria-label={t(ui.contactMe, locale)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-white text-gray-900 transition-transform hover:scale-105"
            >
              <ArrowUpRight size={22} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
