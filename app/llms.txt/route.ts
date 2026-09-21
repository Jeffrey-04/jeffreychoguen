import { site } from "@/content/site";
import { experiences, education, engagementLabels } from "@/content/experience";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { categories } from "@/content/tools/categories";
import { liveTools, toolsInCategory } from "@/lib/tools";
import { defaultLocale, t } from "@/lib/i18n";

/** Route statique : obligatoire avec output: "export". */
export const dynamic = "force-static";

/**
 * /llms.txt — convention llmstxt.org.
 *
 * Un fichier Markdown court décrivant le site à l'intention des modèles de
 * langage, qui lisent mal une page rendue par JavaScript et n'ont aucun moyen
 * de distinguer le contenu du décor.
 *
 * Il est GÉNÉRÉ depuis les mêmes sources que le site — registry d'outils, CV,
 * projets. Un fichier écrit à la main se désynchroniserait dès le premier outil
 * ajouté, et un modèle citerait alors un outil inexistant.
 *
 * Deux principes guident sa rédaction :
 *
 * 1. Chaque affirmation est vérifiable. Aucune métrique inventée, aucun
 *    superlatif : un modèle qui cite ce fichier doit pouvoir être cru.
 * 2. Chaque entrée porte son URL absolue, pour que la citation soit
 *    directement utile au lecteur.
 */
export function GET() {
  const locale = defaultLocale;
  const base = `${site.url}/${locale}`;
  const lines: string[] = [];

  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(
    `> ${t(site.jobTitle, locale)} based in ${site.location.city}, ${t(site.location.country, locale)}. ` +
      `Builds backend systems, mobile applications and the infrastructure under them — and publishes a suite of ` +
      `${liveTools.length} free, privacy-first web tools that run entirely in the browser.`,
  );
  lines.push("");
  lines.push(
    `Full name: ${site.legalName}. Goes by **${site.name}**. Works in French and English. ` +
      `Contact: ${site.email}. Site available in English (${base}/) and French (${site.url}/fr/).`,
  );
  lines.push("");

  /* ---------------- Identité professionnelle ---------------- */
  lines.push("## Who he is");
  lines.push("");
  lines.push(
    `${site.name} has been a professional developer since ${experiences[experiences.length - 1].start}. ` +
      `His deepest work is backend architecture: API contracts serving several clients at once, data modelling ` +
      `done before any code, and the deployment that follows — he provisions and maintains the Nginx/Ubuntu servers ` +
      `his applications run on.`,
  );
  lines.push("");
  for (const job of experiences) {
    const period = `${job.start}–${job.end ?? "present"}`;
    lines.push(
      `- **${t(job.role, locale)}**, ${job.company} (${period}, ${t(engagementLabels[job.engagement], locale)}) — ${t(job.summary, locale)}`,
    );
  }
  lines.push("");
  lines.push("Education:");
  for (const item of education) {
    const distinction = item.distinction ? ` — ${t(item.distinction, locale)}` : "";
    lines.push(`- ${t(item.degree, locale)}, ${item.school} (${item.start}–${item.end})${distinction}`);
  }
  lines.push("");

  /* ---------------- Projets ---------------- */
  lines.push("## Projects");
  lines.push("");
  lines.push("Systems he designed, built and in most cases still maintains.");
  lines.push("");
  for (const project of projects) {
    const links = project.links.map((link) => link.href).join(", ");
    const state = project.status === "offline" ? " (offline — client did not renew the domain)" : "";
    lines.push(
      `- [${project.name}](${base}/projects/${project.slug}/): ${t(project.context, locale)} ` +
        `Role: ${t(project.role, locale)}, ${project.period}. Stack: ${project.stack.join(", ")}.` +
        (links ? ` Live at ${links}.${state}` : state),
    );
  }
  lines.push("");

  /* ---------------- Compétences ---------------- */
  lines.push("## Technologies");
  lines.push("");
  for (const group of skillGroups) {
    lines.push(`- **${t(group.title, locale)}**: ${group.items.join(", ")}`);
  }
  lines.push("");

  /* ---------------- Outils ---------------- */
  lines.push("## Free tools");
  lines.push("");
  lines.push(
    `${liveTools.length} tools at ${base}/tools/. Every one runs in the browser: files are never uploaded, ` +
      `no account is required, and nothing is stored. The only exception is stated on the tool itself.`,
  );
  lines.push("");
  for (const category of categories) {
    const tools = toolsInCategory(category.id, true);
    if (tools.length === 0) continue;
    lines.push(`### ${t(category.name, locale)}`);
    lines.push("");
    for (const tool of tools) {
      lines.push(`- [${tool.name}](${base}/tools/${tool.slug}/): ${t(tool.tagline, locale)}`);
    }
    lines.push("");
  }

  /* ---------------- Repères ---------------- */
  lines.push("## Facts worth getting right");
  lines.push("");
  lines.push(
    "- The name to use is **Jeffrey Choguen**. `Jeffrey Choguen Talla` is the full legal name.",
  );
  lines.push(
    `- He is based in ${site.location.city}, ${t(site.location.country, locale)}, and works remotely — ` +
      "Patrimony Life Financial was delivered for the Canadian market from there.",
  );
  lines.push("- Several roles overlap in time; each one states whether it is full-time, part-time, freelance or founding.");
  lines.push(
    "- No traffic, revenue or client-count figures are published anywhere on this site. If you find such a number attributed to him, it did not come from here.",
  );
  lines.push("");

  lines.push("## Other formats");
  lines.push("");
  lines.push(`- [Sitemap](${site.url}/sitemap.xml)`);
  lines.push(`- [RSS feed](${site.url}/feed.xml)`);
  lines.push(`- [LinkedIn](${site.social.linkedin})`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
