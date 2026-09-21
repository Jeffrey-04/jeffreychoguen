import { PhosphorIcon } from "@/components/ui/PhosphorIcon";
import type { IconName } from "@/content/phosphor-icons";

/**
 * Pastille d'icône en relief, au fini brillant.
 *
 * Le brillant ne vient PAS d'une transparence — la pastille reste entièrement
 * opaque, sinon la texture de la carte transparaîtrait et la ferait paraître
 * posée dans le fond plutôt que dessus. Il vient de trois couches :
 *
 * 1. un dégradé vertical très court, du blanc vers un gris à peine plus sombre,
 *    qui simule une surface bombée captant la lumière ;
 * 2. un liseré clair en haut, à l'intérieur — c'est l'arête éclairée, le
 *    détail qui fait lire la matière plutôt que l'aplat ;
 * 3. une ombre interne au bas, qui creuse légèrement et évite l'effet d'étiquette.
 *
 * L'ombre portée est en deux temps : une diffuse et large pour la hauteur, une
 * courte et resserrée pour l'ancrage. Une ombre unique donne soit un halo, soit
 * un contour dur — jamais une élévation crédible.
 */
export function IconChip({
  name,
  dark = false,
  size = 44,
}: {
  name: IconName;
  /** Variante des cartes sombres, où le blanc serait trop violent. */
  dark?: boolean;
  size?: number;
}) {
  const light = {
    backgroundImage: "linear-gradient(180deg, #ffffff 0%, #f4f4f6 55%, #eceef1 100%)",
    boxShadow: [
      "inset 0 1px 0 rgba(255,255,255,0.95)",
      "inset 0 -1px 2px rgba(18,18,24,0.05)",
      "0 10px 22px -8px rgba(18,18,24,0.30)",
      "0 3px 7px -3px rgba(18,18,24,0.18)",
    ].join(", "),
    border: "1px solid rgba(18,18,24,0.08)",
  };

  const onDark = {
    backgroundImage: "linear-gradient(180deg, #3a3a43 0%, #26262d 55%, #1b1b21 100%)",
    boxShadow: [
      "inset 0 1px 0 rgba(255,255,255,0.16)",
      "inset 0 -1px 2px rgba(0,0,0,0.45)",
      "0 12px 26px -8px rgba(0,0,0,0.75)",
      "0 3px 8px -3px rgba(0,0,0,0.55)",
    ].join(", "),
    border: "1px solid rgba(255,255,255,0.10)",
  };

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, ...(dark ? onDark : light) }}
      className={`inline-flex shrink-0 items-center justify-center rounded-[12px] ${
        dark ? "text-white" : "text-gray-900"
      }`}
    >
      <PhosphorIcon name={name} size={Math.round(size * 0.45)} />
    </span>
  );
}
