import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "inverse";
type Size = "sm" | "md";

/**
 * design.md §5.1 — 4 variantes, rayon 8px.
 */
const base =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-[8px] font-medium " +
  "transition-transform duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "border border-gray-900 text-white [background:linear-gradient(180deg,#24242A_0%,#121218_100%)] " +
    "hover:[background:linear-gradient(180deg,#2f2f37_0%,#1a1a22_100%)]",
  secondary: "border border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200",
  inverse: "border border-gray-200 bg-gray-200 text-gray-900 hover:bg-gray-300",
};

const sizes: Record<Size, string> = {
  md: "px-[22px] py-3 gap-3 text-[16px] leading-6",
  sm: "px-4 py-2 gap-1.5 text-[14px] leading-5",
};

/**
 * Texture fumée du bouton primaire, visible sur la référence Framer.
 * Le template la servait en GIF de 2,5 Mo par bouton ; on réutilise ici
 * l'asset déjà chargé pour les cartes sombres — coût réseau nul, puisque
 * le fichier est en cache. Discrète au repos, renforcée au survol.
 */
function Smoke() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[url('/assets/smoke.webp')] bg-cover bg-center opacity-25 mix-blend-screen transition-opacity duration-500 group-hover:opacity-45"
    />
  );
}

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...rest
}: ButtonBaseProps & ComponentProps<"button">) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {variant === "primary" ? <Smoke /> : null}
      <span className="relative inline-flex items-center gap-[inherit]">{children}</span>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  children,
  className = "",
  href,
  external = false,
  ...rest
}: ButtonBaseProps & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href">) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const inner = (
    <>
      {variant === "primary" ? <Smoke /> : null}
      <span className="relative inline-flex items-center gap-[inherit]">{children}</span>
    </>
  );

  if (external) {
    // Un lien de téléchargement ne s'ouvre pas dans un onglet : certains
    // navigateurs en créent un qui se referme aussitôt, ce qui clignote.
    const isDownload = Boolean((rest as { download?: unknown }).download);
    return (
      <a
        href={href}
        target={isDownload ? undefined : "_blank"}
        rel={isDownload ? undefined : "noopener noreferrer"}
        className={cls}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}
