"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { nav as navDict } from "@/content/dictionary";
import { site } from "@/content/site";
import { getLenis } from "@/components/motion/SmoothScroll";
import { type Locale, locales, path, t } from "@/lib/i18n";

const items = [
  { key: "about", segment: "about" },
  { key: "experience", segment: "experience" },
  { key: "projects", segment: "projects" },
  // Tools remplace Skills dans la navigation principale (tools.md).
  // La page Skills reste publiée et reste liée depuis le pied de page et le CV.
  { key: "tools", segment: "tools" },
  { key: "writing", segment: "writing" },
] as const;

export function Navigation({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fermeture au changement de route.
  useEffect(() => setOpen(false), [pathname]);

  /*
   * Bascule en pastille flottante (design.md §5.4).
   *
   * Le seuil est volontairement supérieur à la hauteur de la barre : basculer
   * dès le premier pixel produirait un clignotement chez qui scrolle de
   * quelques points. La valeur de sortie est plus basse que celle d'entrée —
   * cette hystérésis empêche l'oscillation autour du seuil.
   */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((current) => (current ? y > 80 : y > 140));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Échap + piégeage du focus dans le menu plein écran (design.md §9).
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      getLenis()?.start();
      previous?.focus?.();
    };
  }, [open]);

  const isActive = (segment: string) => pathname?.startsWith(path(locale, segment));

  // L'enveloppe conserve la hauteur dans le flux : sans elle, le passage en
  // position fixe ferait remonter la page d'un bloc.
  return (
    <header className="relative z-40 h-[88px]">
      <div
        className={
          scrolled
            ? "fixed inset-x-0 top-3 z-40 flex justify-center px-4"
            : "absolute inset-x-0 top-0"
        }
      >
        <div
          className={`flex items-center gap-6 transition-[background-color,box-shadow,border-radius,padding] duration-300 ${
            scrolled
              ? "animate-nav-drop rounded-[16px] border border-gray-200 bg-white/90 px-4 py-2.5 shadow-[0_8px_30px_-12px_rgba(18,18,24,0.25)] backdrop-blur-md sm:px-6"
              : "container-page h-[88px] w-full justify-between"
          }`}
        >
        <Link href={path(locale)} className="flex items-center gap-2.5" aria-label={site.name}>
          <span aria-hidden="true" className="logo-mark h-9 text-gray-900" />
          <span className="t-h4 hidden sm:inline">{site.name}</span>
        </Link>

        <nav aria-label={navDict.menu[locale]} className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={path(locale, item.segment)}
                  aria-current={isActive(item.segment) ? "page" : undefined}
                  className={`t-body transition-colors hover:text-gray-900 ${
                    isActive(item.segment) ? "text-gray-900" : ""
                  }`}
                >
                  {t(navDict[item.key], locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} />
          <ButtonLink href={path(locale, "contact")} size="sm" className="hidden sm:inline-flex">
            {t(navDict.letsTalk, locale)}
            <ArrowUpRight size={16} />
          </ButtonLink>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label={t(navDict.menu, locale)}
            className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-gray-200 bg-white text-gray-900 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t(navDict.menu, locale)}
            className="absolute inset-x-3 top-3 rounded-[16px] border border-gray-200 bg-white p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="t-h5">{t(navDict.menu, locale)}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t(navDict.close, locale)}
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-gray-200"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {[{ key: "home", segment: "" } as const, ...items, { key: "contact", segment: "contact" } as const].map(
                (item) => (
                  <li key={item.key}>
                    <Link
                      href={path(locale, item.segment)}
                      className="block rounded-[8px] px-3 py-3 t-h5 hover:bg-gray-100"
                    >
                      {t(navDict[item.key], locale)}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  );
}

/** Sélecteur de langue conservant la route courante (design.md §11.1). */
function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "/";

  return (
    <div className="flex items-center gap-1 text-[14px] leading-5" role="group" aria-label={navDict.language[locale]}>
      {locales.map((l, index) => {
        const target = pathname.replace(/^\/(en|fr)(?=\/|$)/, `/${l}`);
        return (
          <span key={l} className="flex items-center gap-1">
            {index > 0 ? <span aria-hidden="true" className="text-gray-300">/</span> : null}
            <Link
              href={target}
              hrefLang={l}
              aria-current={l === locale ? "true" : undefined}
              className={l === locale ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-900"}
            >
              {l.toUpperCase()}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
