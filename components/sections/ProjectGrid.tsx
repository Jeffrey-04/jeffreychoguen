import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/Icon";
import { ProjectShot } from "@/components/ui/ProjectShot";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay, staggerDelay } from "@/components/motion/motion";
import { ui } from "@/content/dictionary";
import type { Project } from "@/content/projects";
import { type Locale, path, t } from "@/lib/i18n";

/** design.md §5.3 — carte projet : visuel, barre de pied titre + flèche. */
export function ProjectGrid({ locale, items }: { locale: Locale; items: Project[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((project, index) => (
        <Reveal as="li" key={project.slug} delay={staggerDelay(index % 2, revealDelay.cards)}>
          <Card className="h-full overflow-hidden" interactive>
            <Link href={path(locale, `projects/${project.slug}`)} className="block">
              <div
                className={`relative flex aspect-[4/3] overflow-hidden bg-gray-100 p-6 ${
                  project.image ? "items-start" : "items-end"
                }`}
              >
                <div aria-hidden="true" className="absolute inset-0 bg-hatch opacity-60" />
                <div className="relative z-10 flex flex-col gap-2">
                  <span className="font-display text-[32px] leading-tight text-gray-900">
                    {project.name}
                  </span>
                  <span className="t-meta">{project.period}</span>
                </div>

                {/*
                  La capture MONTE depuis le bas de la carte, pleine largeur.
                  Ce sont des écrans de site au format 2:1 : les recadrer par
                  les côtés ferait perdre le logo et la navigation, soit ce qui
                  les rend reconnaissables. Ici seul le bas du site — sa partie
                  la moins signifiante — peut être rogné.
                */}
                {project.image ? (
                  <div className="absolute inset-x-6 bottom-0 top-[42%] overflow-hidden rounded-t-[10px] border border-b-0 border-gray-200 bg-white shadow-[0_-8px_30px_-12px_rgba(18,18,24,0.25)] transition-transform duration-500 group-hover:-translate-y-1">
                    <ProjectShot
                      base={project.image}
                      alt={`${project.name} — ${t(project.context, locale)}`}
                      className="h-auto w-full"
                    />
                  </div>
                ) : null}
                {project.status === "offline" ? (
                  <span className="absolute right-4 top-4 z-10 rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] leading-4 text-gray-500">
                    {t(ui.offline, locale)}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-gray-200 bg-white p-6">
                <div className="flex flex-col gap-1">
                  <span className="t-h4">{t(project.role, locale)}</span>
                  <span className="t-meta">{project.stack.slice(0, 4).join(" · ")}</span>
                </div>
                <ArrowUpRight className="shrink-0 text-gray-900" size={24} />
              </div>
            </Link>
          </Card>
        </Reveal>
      ))}
    </ul>
  );
}
