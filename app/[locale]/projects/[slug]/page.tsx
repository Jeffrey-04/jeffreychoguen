import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ProjectShot } from "@/components/ui/ProjectShot";
import { Card, CardBody } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { CtaSection } from "@/components/sections/CtaSection";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay, staggerDelay } from "@/components/motion/motion";
import { ArrowUpRight } from "@/components/ui/Icon";
import { ui } from "@/content/dictionary";
import { projects } from "@/content/projects";
import { buildMetadata, compactTitle } from "@/lib/seo";
import { locales, path, t, tList, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return buildMetadata({
    locale,
    segment: `projects/${slug}`,
    // exactTitle : sans lui, le layout rajoute « — Jeffrey Choguen » APRÈS
    // le plafonnement, et le titre repasse au-dessus de la limite.
    title: compactTitle(project.name, t(project.role, locale)),
    exactTitle: true,
    description: t(project.context, locale),
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const blocks = [
    { title: t(ui.theProblem, locale), body: t(project.problem, locale) },
    { title: t(ui.theSolution, locale), body: t(project.solution, locale) },
    { title: t(ui.outcome, locale), body: t(project.outcome, locale) },
  ];

  return (
    <>
      <Section labelledBy="project-title">
        <Reveal delay={revealDelay.title}>
          <Link href={path(locale, "projects")} className="t-body-sm mb-8 inline-block hover:text-gray-900">
            ← {t(ui.backToProjects, locale)}
          </Link>
          <div className="flex flex-col items-start gap-4">
            <Badge>{project.period}</Badge>
            <h1 id="project-title" className="t-h1 balanced">{project.name}</h1>
            <p className="t-body-lg max-w-[640px]">{t(project.context, locale)}</p>
          </div>
        </Reveal>

        {/*
          Capture entière ici, contrairement à la carte : sur l'étude de cas
          on montre le produit tel qu'il est livré, pas une vignette. Chargée
          en priorité, c'est le plus grand élément visible — le LCP de la page.
        */}
        {project.image ? (
          <Reveal delay={revealDelay.visual}>
            <div className="mt-12 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-[0_20px_50px_-24px_rgba(18,18,24,0.35)]">
              <ProjectShot
                base={project.image}
                alt={`${project.name} — ${t(project.context, locale)}`}
                className="h-auto w-full"
                priority
              />
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={revealDelay.content}>
          <dl className="mt-12 grid gap-6 border-y border-gray-200 py-8 md:grid-cols-3">
            <div>
              <dt className="t-meta mb-1">{t(ui.role, locale)}</dt>
              <dd className="t-h6">{t(project.role, locale)}</dd>
            </div>
            <div>
              <dt className="t-meta mb-1">{t(ui.stack, locale)}</dt>
              <dd className="t-body">{project.stack.join(" · ")}</dd>
            </div>
            <div>
              <dt className="t-meta mb-1">{locale === "fr" ? "En ligne" : "Live"}</dt>
              <dd className="flex flex-col gap-1">
                {project.links.length ? (
                  project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-body inline-flex items-center gap-1 text-gray-900 underline underline-offset-4"
                    >
                      {link.label}
                      <ArrowUpRight size={14} />
                    </a>
                  ))
                ) : (
                  <span className="t-body">{t(ui.offline, locale)}</span>
                )}
              </dd>
            </div>
          </dl>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {blocks.map((block, index) => (
            <Reveal as="div" key={block.title} delay={staggerDelay(index, revealDelay.cards)}>
              <Card className="h-full">
                <CardBody>
                  <h2 className="t-h4">{block.title}</h2>
                  <p className="t-body">{block.body}</p>
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={revealDelay.content} className="mt-12">
          <Card dark>
            <CardBody className="gap-4 md:p-12">
              <h2 className="t-h3 text-white">{t(ui.keyDecisions, locale)}</h2>
              <ul className="flex flex-col gap-4">
                {tList(project.decisions, locale).map((decision, index) => (
                  <li key={decision} className="flex gap-4 border-b border-white/20 pb-4 last:border-0 last:pb-0">
                    <span aria-hidden="true" className="font-display text-[20px] leading-7 text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[16px] leading-6 text-white/80">{decision}</p>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Reveal>
      </Section>

      <CtaSection locale={locale} />
    </>
  );
}
