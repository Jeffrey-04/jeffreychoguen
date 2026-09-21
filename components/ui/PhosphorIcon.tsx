import { icons, type IconName } from "@/content/phosphor-icons";

/**
 * Icône Phosphor inline (design.md §8.1).
 * Le tracé est injecté depuis un fichier généré : pas de paquet React à
 * charger, pas de requête réseau, et la teinte suit currentColor.
 */
export function PhosphorIcon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const icon = icons[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="currentColor"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: icon.inner }}
    />
  );
}
