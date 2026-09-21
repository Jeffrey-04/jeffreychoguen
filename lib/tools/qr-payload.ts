/**
 * Construction des charges utiles de QR code.
 *
 * Chaque type suit une convention établie que les lecteurs de téléphone
 * reconnaissent. Les formats ne sont pas interchangeables : un réseau Wi-Fi
 * écrit en texte libre ne déclenchera aucune connexion automatique.
 */

export type QrType =
  | "url"
  | "text"
  | "wifi"
  | "email"
  | "phone"
  | "sms"
  | "whatsapp"
  | "vcard"
  | "location"
  | "event";

export type QrFields = Record<string, string>;

/**
 * Échappement du format Wi-Fi : `\ ; , :` ont une signification syntaxique.
 * Sans cela, un mot de passe contenant un point-virgule casse le code.
 */
function escapeWifi(value: string): string {
  return value.replace(/([\;,:"])/g, "\\$1");
}

/** Le vCard impose des retours chariot CRLF, pas de simples sauts de ligne. */
function vcardLines(lines: string[]): string {
  return lines.join("\r\n");
}

export function buildPayload(type: QrType, f: QrFields): string {
  switch (type) {
    case "url": {
      const value = (f.url ?? "").trim();
      if (!value) return "";
      // Sans schéma, beaucoup de lecteurs traitent la valeur comme du texte.
      return /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
    }

    case "text":
      return f.text ?? "";

    case "wifi": {
      if (!f.ssid) return "";
      const security = f.security || "WPA";
      const hidden = f.hidden === "true" ? "H:true;" : "";
      const password = security === "nopass" ? "" : `P:${escapeWifi(f.password ?? "")};`;
      return `WIFI:T:${security};S:${escapeWifi(f.ssid)};${password}${hidden};`;
    }

    case "email": {
      if (!f.to) return "";
      const params = new URLSearchParams();
      if (f.subject) params.set("subject", f.subject);
      if (f.body) params.set("body", f.body);
      const query = params.toString();
      return `mailto:${f.to}${query ? `?${query}` : ""}`;
    }

    case "phone":
      return f.phone ? `tel:${f.phone.replace(/\s/g, "")}` : "";

    case "sms": {
      if (!f.phone) return "";
      const number = f.phone.replace(/\s/g, "");
      return f.message ? `SMSTO:${number}:${f.message}` : `SMSTO:${number}`;
    }

    case "whatsapp": {
      if (!f.phone) return "";
      // wa.me n'accepte que des chiffres : ni +, ni espaces, ni tirets.
      const number = f.phone.replace(/[^\d]/g, "");
      const text = f.message ? `?text=${encodeURIComponent(f.message)}` : "";
      return `https://wa.me/${number}${text}`;
    }

    case "vcard": {
      if (!f.lastName && !f.firstName) return "";
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${f.lastName ?? ""};${f.firstName ?? ""};;;`,
        `FN:${[f.firstName, f.lastName].filter(Boolean).join(" ")}`,
      ];
      if (f.organisation) lines.push(`ORG:${f.organisation}`);
      if (f.title) lines.push(`TITLE:${f.title}`);
      if (f.phone) lines.push(`TEL;TYPE=CELL:${f.phone}`);
      if (f.email) lines.push(`EMAIL:${f.email}`);
      if (f.url) lines.push(`URL:${f.url}`);
      lines.push("END:VCARD");
      return vcardLines(lines);
    }

    case "location": {
      if (!f.latitude || !f.longitude) return "";
      return `geo:${f.latitude},${f.longitude}`;
    }

    case "event": {
      if (!f.summary || !f.start) return "";
      // Format iCalendar : AAAAMMJJTHHMMSS, sans séparateur.
      const stamp = (value: string) => value.replace(/[-:]/g, "").replace(/\.\d+/, "");
      const lines = [
        "BEGIN:VEVENT",
        `SUMMARY:${f.summary}`,
        `DTSTART:${stamp(f.start)}`,
      ];
      if (f.end) lines.push(`DTEND:${stamp(f.end)}`);
      if (f.location) lines.push(`LOCATION:${f.location}`);
      lines.push("END:VEVENT");
      return vcardLines(lines);
    }
  }
}
