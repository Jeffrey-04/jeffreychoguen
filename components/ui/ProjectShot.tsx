/**
 * Capture d'écran d'un projet, servie en AVIF avec repli WebP.
 *
 * Un <picture> natif plutôt que next/image : en export statique, next/image
 * ne peut rien optimiser à la volée — les formats sont déjà produits par
 * scripts/optimize-assets.mjs. Laisser le navigateur choisir entre eux
 * suffit, et évite d'embarquer un composant qui ne ferait rien.
 */
export function ProjectShot({
  base,
  alt,
  className = "",
  priority = false,
}: {
  /** Chemin sans extension, ex. « /assets/projects/colisgo ». */
  base: string;
  alt: string;
  className?: string;
  /** Au-dessus de la ligne de flottaison : chargement immédiat. */
  priority?: boolean;
}) {
  return (
    <picture>
      <source srcSet={`${base}.avif`} type="image/avif" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}.webp`}
        alt={alt}
        width={1600}
        height={790}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={className}
      />
    </picture>
  );
}
