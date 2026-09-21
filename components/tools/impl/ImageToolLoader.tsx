"use client";

import { usePathname } from "next/navigation";
import { ImageTool, type ImageToolConfig } from "@/components/tools/impl/ImageTool";
import type { Locale } from "@/lib/i18n";

/**
 * Les six outils d'image partagent une interface et ne diffèrent que par leur
 * configuration. Le slug est lu depuis l'URL : cela évite de dupliquer six
 * modules identiques, et donc six chunks pour un même composant.
 */
const RASTER = ["image/jpeg", "image/png", "image/webp"];

const CONFIGS: Record<string, ImageToolConfig> = {
  "image-compressor": {
    slug: "image-compressor",
    accept: RASTER,
    outputs: ["image/jpeg", "image/png", "image/webp"],
    keepFormat: true,
    showQuality: true,
    showTargetSize: true,
  },
  "image-resizer": {
    slug: "image-resizer",
    accept: RASTER,
    outputs: ["image/jpeg", "image/png", "image/webp"],
    keepFormat: true,
    showResize: true,
    showQuality: true,
  },
  "image-converter": {
    slug: "image-converter",
    accept: [...RASTER, "image/avif", "image/bmp", "image/gif"],
    outputs: ["image/jpeg", "image/png", "image/webp"],
    showQuality: true,
    showResize: true,
    showBackground: true,
  },
  "png-to-jpg": {
    slug: "png-to-jpg",
    accept: ["image/png"],
    outputs: ["image/jpeg"],
    showQuality: true,
    showBackground: true,
  },
  "jpg-to-png": { slug: "jpg-to-png", accept: ["image/jpeg"], outputs: ["image/png"] },
  "webp-converter": {
    slug: "webp-converter",
    accept: RASTER,
    outputs: ["image/webp", "image/jpeg", "image/png"],
    showQuality: true,
    showBackground: true,
  },
};

export default function ImageToolLoader({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";
  const slug = pathname.replace(/\/$/, "").split("/").pop() ?? "";
  const config = CONFIGS[slug] ?? CONFIGS["image-compressor"];
  return <ImageTool config={config} locale={locale} />;
}
