import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";
import { Mail, Pin, Clock, LinkedIn } from "@/components/ui/Icon";
import { sections } from "@/content/dictionary";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { locales, t, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    segment: "contact",
    title: t(sections.contact.title, locale),
    description: t(sections.contact.description, locale),
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  const rows = [
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: LinkedIn, label: "LinkedIn", value: "Jeffrey Choguen", href: site.social.linkedin },
    {
      icon: Pin,
      label: locale === "fr" ? "Localisation" : "Location",
      value: `${site.location.city}, ${t(site.location.country, locale)}`,
    },
    {
      icon: Clock,
      label: locale === "fr" ? "Fuseau horaire" : "Time zone",
      value: "WAT (UTC+1)",
    },
  ];

  return (
    <Section labelledBy="contact-title">
      <Reveal delay={revealDelay.title}>
        <div className="mb-16 flex flex-col items-start gap-3">
          <Badge>{t(sections.contact.badge, locale)}</Badge>
          <h1 id="contact-title" className="t-h1 balanced max-w-[720px]">
            {t(sections.contact.title, locale)}
          </h1>
          <p className="t-body-lg max-w-[520px]">{t(sections.contact.description, locale)}</p>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Reveal delay={revealDelay.content}>
          <Card>
            <CardBody className="md:p-10">
              <ContactForm locale={locale} />
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={revealDelay.cards}>
          <Card dark className="h-full">
            <CardBody className="gap-5 md:p-10">
              <ul className="flex flex-col gap-5">
                {rows.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-center gap-4 border-b border-white/20 pb-5 last:border-0 last:pb-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] leading-5 text-white/60">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="truncate text-[16px] leading-6 text-white underline underline-offset-4"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="truncate text-[16px] leading-6 text-white">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
