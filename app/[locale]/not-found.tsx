import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ui } from "@/content/dictionary";
import { defaultLocale, path, t } from "@/lib/i18n";

export default function NotFound() {
  const locale = defaultLocale;
  return (
    <Section>
      <div className="flex min-h-[40vh] flex-col items-start justify-center gap-4">
        <p className="font-display text-[72px] leading-none text-gray-300">404</p>
        <h1 className="t-h2">{t(ui.notFoundTitle, locale)}</h1>
        <p className="t-body-lg max-w-[420px]">{t(ui.notFoundBody, locale)}</p>
        <Link href={path(locale)} className="t-body mt-2 text-gray-900 underline underline-offset-4">
          {t(ui.backHome, locale)}
        </Link>
      </div>
    </Section>
  );
}
