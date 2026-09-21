import { ArrowUpRight, Mail, Pin, Clock } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";
import { sections, ui } from "@/content/dictionary";
import { site } from "@/content/site";
import { type Locale, path, t } from "@/lib/i18n";

/** design.md §6.1 #12 — bloc 2 colonnes rayon 32px, carte sombre à droite. */
export function CtaSection({ locale }: { locale: Locale }) {
  const rows = [
    { icon: Mail, label: locale === "fr" ? "Email" : "Email", value: site.email },
    {
      icon: Pin,
      label: locale === "fr" ? "Localisation" : "Location",
      value: `${site.location.city}, ${t(site.location.country, locale)} · ${locale === "fr" ? "à distance" : "remote"}`,
    },
    {
      icon: Clock,
      label: locale === "fr" ? "Langues" : "Languages",
      value: locale === "fr" ? "Français · Anglais" : "French · English",
    },
  ];

  return (
    <section className="container-page pb-16" aria-labelledby="cta-title">
      <div className="grid overflow-hidden rounded-[32px] border border-gray-200 md:grid-cols-2">
        <Reveal delay={revealDelay.content} className="bg-gray-100">
          <div className="flex h-full flex-col items-start gap-5 p-8 md:p-12">
            <Badge>{t(sections.contact.badge, locale)}</Badge>
            <h2 id="cta-title" className="t-h2 balanced">
              {t(sections.contact.title, locale)}
            </h2>
            <p className="t-body-lg balanced">{t(sections.contact.description, locale)}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <ButtonLink href={path(locale, "contact")}>
                {t(ui.contactMe, locale)}
                <ArrowUpRight />
              </ButtonLink>
              <ButtonLink href={path(locale, "projects")} variant="secondary">
                {t(ui.viewMyWork, locale)}
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <Reveal delay={revealDelay.cards}>
          <div className="card-dark h-full p-8 md:p-12">
            <ul className="flex flex-col gap-5">
              {rows.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-center gap-4 border-b border-white/20 pb-5 last:border-0 last:pb-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-5 text-white/60">{label}</p>
                    <p className="truncate text-[16px] leading-6 text-white">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
