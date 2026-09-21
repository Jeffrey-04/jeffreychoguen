import { icons, type IconName } from "@/content/tools/icons";

/**
 * Icône des pages outils. Jumelle de PhosphorIcon, mais puisant dans le jeu
 * dédié aux outils : c'est cette séparation qui évite que l'accueil embarque
 * les icônes de catégories dont il n'a aucun usage.
 */
export function ToolIcon({
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
