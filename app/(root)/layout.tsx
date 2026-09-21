/**
 * Layout racine de la seule route hors langue : `/`.
 * Le site a deux layouts racines — celui-ci et app/[locale]/layout.tsx —
 * chacun rendant son propre <html>, car seul le second connaît la langue.
 */
export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
