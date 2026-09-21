"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";

/**
 * design.md §5.10 — champs, rayon 12px, fond gray-50, bordure gray-200.
 *
 * L'export statique n'exécute aucun code serveur : l'envoi passe par un
 * endpoint externe défini dans NEXT_PUBLIC_CONTACT_ENDPOINT.
 * La validation, le rate limiting et l'anti-spam serveur exigés par guide.md
 * doivent être assurés PAR CET ENDPOINT — ce qui suit n'est que la première
 * barrière, côté client. Sans endpoint configuré, le formulaire bascule
 * proprement sur un lien mailto.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

const copy = {
  name: { en: "Name", fr: "Nom" },
  email: { en: "Email", fr: "Email" },
  type: { en: "Project type", fr: "Type de projet" },
  message: { en: "Message", fr: "Message" },
  send: { en: "Send message", fr: "Envoyer le message" },
  sending: { en: "Sending…", fr: "Envoi…" },
  ok: { en: "Thank you — your message has been sent. I read every one.", fr: "Merci — votre message est parti. Je les lis tous." },
  error: {
    en: "The message could not be sent. Please email me directly instead.",
    fr: "Le message n'a pas pu être envoyé. Écrivez-moi directement par email.",
  },
  invalidEmail: { en: "Please enter a valid email address.", fr: "Merci d'indiquer une adresse email valide." },
  required: { en: "This field is required.", fr: "Ce champ est obligatoire." },
  noEndpoint: {
    en: "Email is the fastest way to reach me:",
    fr: "L'email est le moyen le plus rapide de me joindre :",
  },
} as const;

const projectTypes = {
  en: ["Backend", "Mobile app", "Web app", "Consulting", "Other"],
  fr: ["Backend", "Application mobile", "Application web", "Conseil", "Autre"],
};

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!ENDPOINT) {
    return (
      <div className="flex flex-col gap-3">
        <p className="t-body">{copy.noEndpoint[locale]}</p>
        <a href={`mailto:${site.email}`} className="t-h4 text-gray-900 underline underline-offset-4">
          {site.email}
        </a>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot : rempli uniquement par un robot.
    if (data.get("company")) return;

    const next: Record<string, string> = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name) next.name = copy.required[locale];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = copy.invalidEmail[locale];
    if (!message) next.message = copy.required[locale];

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      setStatus(response.ok ? "sent" : "error");
      if (response.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-3 text-[16px] leading-6 text-gray-900 placeholder:text-gray-500";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <p aria-hidden="true" className="hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="t-body-sm mb-2 block">{copy.name[locale]}</label>
          <input
            id="name" name="name" type="text" autoComplete="name" required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={field}
          />
          {errors.name ? <p id="name-error" className="t-body-sm mt-1 text-gray-900">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="email" className="t-body-sm mb-2 block">{copy.email[locale]}</label>
          <input
            id="email" name="email" type="email" autoComplete="email" required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={field}
          />
          {errors.email ? <p id="email-error" className="t-body-sm mt-1 text-gray-900">{errors.email}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="type" className="t-body-sm mb-2 block">{copy.type[locale]}</label>
        <select id="type" name="type" className={field} defaultValue={projectTypes[locale][0]}>
          {projectTypes[locale].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="t-body-sm mb-2 block">{copy.message[locale]}</label>
        <textarea
          id="message" name="message" rows={5} required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${field} min-h-[120px] resize-y`}
        />
        {errors.message ? <p id="message-error" className="t-body-sm mt-1 text-gray-900">{errors.message}</p> : null}
      </div>

      <Button type="submit" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? copy.sending[locale] : copy.send[locale]}
      </Button>

      <p aria-live="polite" className="t-body-sm min-h-5">
        {status === "sent" ? copy.ok[locale] : status === "error" ? copy.error[locale] : ""}
      </p>
    </form>
  );
}
