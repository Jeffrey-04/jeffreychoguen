import Link from "next/link";
import { LinkedIn, GitHub, Mail } from "@/components/ui/Icon";
import { nav as navDict } from "@/content/dictionary";
import { site } from "@/content/site";
import { type Locale, path, t } from "@/lib/i18n";

const pages = [
  { key: "about", segment: "about" },
  { key: "experience", segment: "experience" },
  { key: "projects", segment: "projects" },
  { key: "skills", segment: "skills" },
  { key: "tools", segment: "tools" },
  { key: "writing", segment: "writing" },
  { key: "contact", segment: "contact" },
] as const;

/** design.md §5.5 — bloc blanc rayon 32px, wordmark, barre finale sombre. */
export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="container-page pb-6">
      <div className="overflow-hidden rounded-[32px] border border-gray-200 bg-white">
        <div className="grid gap-10 p-8 md:grid-cols-[1.5fr_1fr_1fr] md:p-12">
          <div className="flex flex-col gap-4">
            <Link href={path(locale)} className="flex items-center gap-2.5">
              <span aria-hidden="true" className="logo-mark h-9 text-gray-900" />
              <span className="t-h4">{site.name}</span>
            </Link>
            <p className="t-body max-w-[460px]">{t(site.tagline, locale)}</p>
            <p className="t-meta">
              {site.location.city}, {t(site.location.country, locale)}
            </p>
          </div>

          <nav aria-labelledby="footer-pages">
            <h2 id="footer-pages" className="t-label mb-4">
              {locale === "fr" ? "Pages" : "Pages"}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {pages.map((page) => (
                <li key={page.key}>
                  <Link href={path(locale, page.segment)} className="t-body hover:text-gray-900">
                    {t(navDict[page.key], locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="t-label mb-4">{locale === "fr" ? "Ailleurs" : "Elsewhere"}</h2>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-body inline-flex items-center gap-2 hover:text-gray-900"
                >
                  <LinkedIn size={16} /> LinkedIn
                </a>
              </li>
              {site.showGithub ? (
                <li>
                  <a
                    href={site.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-body inline-flex items-center gap-2 hover:text-gray-900"
                  >
                    <GitHub size={16} /> GitHub
                  </a>
                </li>
              ) : null}
              <li>
                <a href={`mailto:${site.email}`} className="t-body inline-flex items-center gap-2 hover:text-gray-900">
                  <Mail size={16} /> {locale === "fr" ? "Email" : "Email"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Wordmark chromé, recadré par la barre sombre comme dans la référence
            (screens/lt-prev.jpg). En SVG plutôt qu'en texte : textLength garantit
            que « JEFFREY CHOGUEN » tient exactement dans la largeur à toute
            taille d'écran, ce qu'un clamp() en vw ne peut pas assurer.
            Remplace le SVG de 2 Mo du template. */}
        <div className="relative mt-4 overflow-hidden px-8 md:px-12" aria-hidden="true">
          <svg
            viewBox="0 0 1000 70"
            className="block w-full"
            role="presentation"
            focusable="false"
          >
            <defs>
              <linearGradient id="jc-chrome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f7f7f8" />
                <stop offset="20%" stopColor="#94979e" />
                <stop offset="36%" stopColor="#24242a" />
                <stop offset="50%" stopColor="#c9cdd2" />
                <stop offset="58%" stopColor="#ffffff" />
                <stop offset="72%" stopColor="#61646b" />
                <stop offset="88%" stopColor="#1b1b21" />
                <stop offset="100%" stopColor="#94979e" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative bg-gray-900 px-8 py-5 md:px-12">
          <p className="text-[14px] leading-5 text-white/60">
            © {year} {site.name} · {site.location.city}, {t(site.location.country, locale)}
          </p>
        </div>
      </div>
    </footer>
  );
}
