import type { Metadata } from "next";
import { site } from "@/content/site";
import { defaultLocale, locales } from "@/lib/i18n";

/**
 * Racine du site. L'export statique interdit tout middleware : la détection
 * de langue se fait donc côté client, avec un repli meta refresh pour les
 * clients sans JavaScript. hreflang x-default pointe vers cette URL.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — Full Stack Software Engineer`,
  robots: { index: false, follow: true },
  alternates: {
    canonical: `/${defaultLocale}/`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}/`])),
      "x-default": "/",
    },
  },
};

const script = `
(function () {
  var supported = ${JSON.stringify(locales)}, fallback = ${JSON.stringify(defaultLocale)};
  var langs = navigator.languages || [navigator.language || fallback], target = fallback;
  for (var i = 0; i < langs.length; i++) {
    var code = String(langs[i]).slice(0, 2).toLowerCase();
    if (supported.indexOf(code) !== -1) { target = code; break; }
  }
  window.location.replace("/" + target + "/");
})();
`;

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}/`} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <p style={{ fontFamily: "system-ui", padding: "2rem" }}>
        <a href={`/${defaultLocale}/`}>Continue to jeffreychoguen.cloud →</a>
      </p>
    </>
  );
}
