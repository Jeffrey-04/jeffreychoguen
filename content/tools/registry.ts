import type { I18nList, I18nText } from "@/lib/i18n";
import type { CategoryId } from "@/content/tools/categories";

/**
 * Registry des outils — source unique du catalogue, de la recherche, des
 * outils liés, du sitemap, des metadata et des fils d'Ariane (tools.md §17).
 *
 * Deux règles s'appliquent mécaniquement depuis ce fichier :
 *
 * 1. Seuls les outils `status: "live"` obtiennent une URL. Un outil listé mais
 *    non construit apparaît au catalogue sans générer de page vide — la règle
 *    absolue de tools.md : jamais d'URL sans outil derrière.
 * 2. Le badge de confidentialité DÉCOULE de `processing`. Il n'est jamais écrit
 *    à la main, ce qui rend impossible d'afficher « traitement local » sur un
 *    outil qui envoie les données ailleurs.
 */
export type ToolProcessing = "client" | "external-api";

export type ToolDefinition = {
  slug: string;
  category: CategoryId;
  priority: "S" | "A" | "B";
  /**
   * Le nom reste en ANGLAIS dans les deux langues : « Image Compressor » est le
   * terme effectivement saisi dans les moteurs, y compris par les francophones.
   * Ce sont le tagline et la description qui portent la traduction.
   */
  name: string;
  tagline: I18nText;
  description: I18nText;
  processing: ToolProcessing;
  inputTypes?: string[];
  outputTypes?: string[];
  /** Slugs d'outils liés — la réciprocité est vérifiée au build. */
  relatedTools: string[];
  /** Synonymes alimentant la recherche : « compress photo » → image-compressor. */
  keywords: I18nList;
  faq?: { q: I18nText; a: I18nText }[];
  status: "live" | "planned";
};

const t = (en: string, fr: string): I18nText => ({ en, fr });
const l = (en: string[], fr: string[]): I18nList => ({ en, fr });

export const tools: ToolDefinition[] = [
  /* ---------------------------------------------------------------
     Sécurité
     --------------------------------------------------------------- */
  {
    slug: "password-generator",
    category: "security",
    priority: "S",
    name: "Password Generator",
    tagline: t("Strong passwords, generated on your device.", "Des mots de passe solides, générés sur votre appareil."),
    description: t(
      "Generate strong, random passwords using your browser's cryptographic generator. Nothing is sent anywhere, and nothing is stored.",
      "Générez des mots de passe forts et aléatoires avec le générateur cryptographique de votre navigateur. Rien n'est envoyé nulle part, rien n'est conservé.",
    ),
    processing: "client",
    outputTypes: ["text"],
    relatedTools: ["uuid-generator", "base64"],
    keywords: l(
      ["password generator", "random password", "strong password", "secure password"],
      ["générateur de mot de passe", "mot de passe aléatoire", "mot de passe sécurisé"],
    ),
    faq: [
      {
        q: t("Are these passwords really random?", "Ces mots de passe sont-ils vraiment aléatoires ?"),
        a: t(
          "They come from the Web Crypto API, the same cryptographic generator browsers use for security operations — not from Math.random(), which is predictable.",
          "Ils proviennent de la Web Crypto API, le générateur cryptographique que les navigateurs utilisent pour leurs opérations de sécurité — et non de Math.random(), qui est prévisible.",
        ),
      },
      {
        q: t("Do you store or transmit the passwords?", "Conservez-vous ou transmettez-vous les mots de passe ?"),
        a: t(
          "No. The generation happens entirely in your browser. The page makes no network request while you use it.",
          "Non. La génération se fait entièrement dans votre navigateur. La page n'effectue aucune requête réseau pendant son utilisation.",
        ),
      },
      {
        q: t("Is this a password manager?", "Est-ce un gestionnaire de mots de passe ?"),
        a: t(
          "No — it only generates. Store the result in a real password manager; this tool keeps nothing.",
          "Non — il ne fait que générer. Conservez le résultat dans un vrai gestionnaire de mots de passe ; cet outil ne garde rien.",
        ),
      },
    ],
    status: "live",
  },

  /* ---------------------------------------------------------------
     Développeur
     --------------------------------------------------------------- */
  {
    slug: "uuid-generator",
    category: "developer",
    priority: "S",
    name: "UUID Generator",
    tagline: t("Version 4 UUIDs, in bulk.", "Des UUID version 4, en lot."),
    description: t(
      "Generate RFC 4122 version 4 UUIDs one at a time or in bulk, straight from your browser's cryptographic generator.",
      "Générez des UUID version 4 conformes à la RFC 4122, à l'unité ou en lot, depuis le générateur cryptographique de votre navigateur.",
    ),
    processing: "client",
    outputTypes: ["text"],
    relatedTools: ["password-generator", "base64"],
    keywords: l(["uuid generator", "guid generator", "uuid v4", "random id"], ["générateur uuid", "générateur guid", "identifiant aléatoire"]),
    status: "live",
  },
  {
    slug: "base64",
    category: "developer",
    priority: "S",
    name: "Base64 Encoder / Decoder",
    tagline: t("Encode and decode Base64, both ways.", "Encodez et décodez du Base64, dans les deux sens."),
    description: t(
      "Convert text or files to Base64 and back. Handles UTF-8 correctly, which most quick online converters get wrong.",
      "Convertissez du texte ou des fichiers en Base64 et inversement. Gère correctement l'UTF-8, là où beaucoup de convertisseurs en ligne se trompent.",
    ),
    processing: "client",
    inputTypes: ["text"],
    outputTypes: ["text"],
    relatedTools: ["uuid-generator", "password-generator", "json-formatter"],
    keywords: l(["base64 encode", "base64 decode", "base64 converter"], ["encoder base64", "décoder base64", "convertisseur base64"]),
    status: "live",
  },
  {
    slug: "json-formatter",
    category: "developer",
    priority: "S",
    name: "JSON Formatter",
    tagline: t("Make unreadable JSON readable.", "Rendre lisible un JSON qui ne l'est pas."),
    description: t(
      "Format, indent and minify JSON. Errors are reported with their line and column, so you can find the problem instead of hunting for it.",
      "Formatez, indentez et minifiez du JSON. Les erreurs sont signalées avec leur ligne et leur colonne, pour trouver le problème plutôt que le chercher.",
    ),
    processing: "client",
    inputTypes: ["text"],
    outputTypes: ["text"],
    relatedTools: ["json-validator", "base64"],
    keywords: l(["json formatter", "json beautifier", "pretty json", "format json"], ["formateur json", "indenter json", "embellir json"]),
    status: "live",
  },
  {
    slug: "json-validator",
    category: "developer",
    priority: "S",
    name: "JSON Validator",
    tagline: t("Find out exactly where the JSON breaks.", "Savoir exactement où le JSON casse."),
    description: t(
      "Check whether a JSON document is valid and get the precise position of the first error.",
      "Vérifiez qu'un document JSON est valide et obtenez la position exacte de la première erreur.",
    ),
    processing: "client",
    inputTypes: ["text"],
    relatedTools: ["json-formatter", "base64"],
    keywords: l(["json validator", "validate json", "json checker", "json syntax error"], ["validateur json", "valider json", "erreur syntaxe json"]),
    status: "live",
  },

  /* ---------------------------------------------------------------
     Texte
     --------------------------------------------------------------- */
  {
    slug: "word-counter",
    category: "text",
    priority: "S",
    name: "Word Counter",
    tagline: t("Words, characters, sentences and reading time.", "Mots, caractères, phrases et temps de lecture."),
    description: t(
      "Count words, characters, sentences and paragraphs as you type, with an estimated reading time.",
      "Comptez mots, caractères, phrases et paragraphes à la frappe, avec une estimation du temps de lecture.",
    ),
    processing: "client",
    inputTypes: ["text"],
    relatedTools: ["case-converter"],
    keywords: l(["word counter", "character count", "letter count", "reading time"], ["compteur de mots", "nombre de caractères", "temps de lecture"]),
    status: "live",
  },
  {
    slug: "case-converter",
    category: "text",
    priority: "S",
    name: "Case Converter",
    tagline: t("Switch between every common casing.", "Passer d'une casse à l'autre."),
    description: t(
      "Convert text to upper, lower, title, sentence, camel, snake and kebab case.",
      "Convertissez du texte en majuscules, minuscules, casse de titre, de phrase, camel, snake et kebab.",
    ),
    processing: "client",
    inputTypes: ["text"],
    relatedTools: ["word-counter"],
    keywords: l(["case converter", "uppercase", "lowercase", "title case", "camel case"], ["convertisseur de casse", "majuscules", "minuscules"]),
    status: "live",
  },

  /* ---------------------------------------------------------------
     Calculatrices
     --------------------------------------------------------------- */
  {
    slug: "percentage-calculator",
    category: "calculators",
    priority: "S",
    name: "Percentage Calculator",
    tagline: t("Every percentage question, one page.", "Toutes les questions de pourcentage, sur une page."),
    description: t(
      "Work out percentages, increases, decreases and differences without setting up the formula yourself.",
      "Calculez pourcentages, hausses, baisses et écarts sans avoir à poser la formule.",
    ),
    processing: "client",
    relatedTools: [],
    keywords: l(["percentage calculator", "percent increase", "percent decrease", "percentage of a number"], ["calculatrice pourcentage", "augmentation en pourcentage", "pourcentage d'un nombre"]),
    status: "live",
  },

  /* ---------------------------------------------------------------
     Images
     --------------------------------------------------------------- */
  {
    slug: "image-compressor",
    category: "images",
    priority: "S",
    name: "Image Compressor",
    tagline: t("Smaller images, same picture.", "Des images plus légères, la même photo."),
    description: t(
      "Compress JPG, PNG and WebP images in your browser, with a before-and-after comparison and a target file size.",
      "Compressez vos images JPG, PNG et WebP dans le navigateur, avec comparaison avant/après et taille cible.",
    ),
    processing: "client",
    inputTypes: ["image/jpeg", "image/png", "image/webp"],
    outputTypes: ["image/jpeg", "image/png", "image/webp"],
    relatedTools: ["image-resizer", "image-converter", "webp-converter"],
    keywords: l(["compress image", "compress photo", "reduce image size", "image optimizer"], ["compresser une image", "compresser une photo", "réduire la taille d'une image"]),
    status: "live",
  },
  {
    slug: "image-resizer",
    category: "images",
    priority: "S",
    name: "Image Resizer",
    tagline: t("Exact dimensions, locked ratio.", "Dimensions exactes, ratio verrouillé."),
    description: t(
      "Resize images by pixels or percentage, with an optional locked aspect ratio and presets for social platforms.",
      "Redimensionnez vos images en pixels ou en pourcentage, avec ratio verrouillable et préréglages pour les réseaux sociaux.",
    ),
    processing: "client",
    inputTypes: ["image/jpeg", "image/png", "image/webp"],
    outputTypes: ["image/jpeg", "image/png", "image/webp"],
    relatedTools: ["image-compressor", "image-converter"],
    keywords: l(["resize image", "image resizer", "change image dimensions"], ["redimensionner une image", "changer les dimensions d'une image"]),
    status: "live",
  },
  {
    slug: "image-converter",
    category: "images",
    priority: "S",
    name: "Image Converter",
    tagline: t("Between JPG, PNG, WebP and AVIF.", "Entre JPG, PNG, WebP et AVIF."),
    description: t(
      "Convert images between JPG, PNG, WebP and AVIF, one at a time or in batch.",
      "Convertissez vos images entre JPG, PNG, WebP et AVIF, à l'unité ou en lot.",
    ),
    processing: "client",
    inputTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    outputTypes: ["image/jpeg", "image/png", "image/webp"],
    relatedTools: ["image-compressor", "image-resizer", "png-to-jpg", "jpg-to-png", "webp-converter"],
    keywords: l(["image converter", "convert image format"], ["convertisseur d'image", "convertir le format d'une image"]),
    status: "live",
  },
  {
    slug: "png-to-jpg",
    category: "images",
    priority: "S",
    name: "PNG to JPG",
    tagline: t("PNG to JPG, with a background colour.", "PNG vers JPG, avec couleur de fond."),
    description: t(
      "Convert PNG images to JPG and choose what replaces the transparency.",
      "Convertissez vos PNG en JPG et choisissez ce qui remplace la transparence.",
    ),
    processing: "client",
    inputTypes: ["image/png"],
    outputTypes: ["image/jpeg"],
    relatedTools: ["jpg-to-png", "image-converter"],
    keywords: l(["png to jpg", "png to jpeg", "convert png"], ["png en jpg", "convertir png"]),
    status: "live",
  },
  {
    slug: "jpg-to-png",
    category: "images",
    priority: "S",
    name: "JPG to PNG",
    tagline: t("JPG to lossless PNG.", "JPG vers PNG sans perte."),
    description: t(
      "Convert JPG images to PNG when you need a lossless format.",
      "Convertissez vos JPG en PNG lorsque vous avez besoin d'un format sans perte.",
    ),
    processing: "client",
    inputTypes: ["image/jpeg"],
    outputTypes: ["image/png"],
    relatedTools: ["png-to-jpg", "image-converter"],
    keywords: l(["jpg to png", "jpeg to png", "convert jpg"], ["jpg en png", "convertir jpg"]),
    status: "live",
  },
  {
    slug: "webp-converter",
    category: "images",
    priority: "S",
    name: "WebP Converter",
    tagline: t("To and from WebP.", "Vers et depuis le WebP."),
    description: t(
      "Convert images to WebP for the web, or back to JPG and PNG for tools that do not read it.",
      "Convertissez vos images en WebP pour le web, ou l'inverse vers JPG et PNG pour les outils qui ne le lisent pas.",
    ),
    processing: "client",
    inputTypes: ["image/jpeg", "image/png", "image/webp"],
    outputTypes: ["image/webp", "image/jpeg", "image/png"],
    relatedTools: ["image-converter", "image-compressor"],
    keywords: l(["webp converter", "convert to webp", "webp to jpg", "webp to png"], ["convertisseur webp", "convertir en webp", "webp en jpg"]),
    status: "live",
  },
  {
    slug: "background-remover",
    category: "images",
    priority: "S",
    name: "Background Remover",
    tagline: t("Cut the subject out of a photo.", "Détourer le sujet d'une photo."),
    description: t(
      "Remove the background from a photo and export a transparent PNG. The model runs on your own device — the photo never leaves it. It weighs about 54 MB and is downloaded once, with your consent.",
      "Supprimez l'arrière-plan d'une photo et exportez un PNG transparent. Le modèle s'exécute sur votre appareil — la photo n'en sort jamais. Il pèse environ 54 Mo, téléchargé une seule fois, avec votre accord.",
    ),
    /*
     * Par défaut le traitement est LOCAL : un export statique ne peut détenir
     * aucune clé d'API, la voie externe n'existe donc que si un proxy est
     * configuré via NEXT_PUBLIC_BG_REMOVAL_ENDPOINT. Le badge suit ce défaut,
     * et l'outil affiche lui-même l'avertissement si l'endpoint est actif.
     */
    processing: "client",
    inputTypes: ["image/jpeg", "image/png"],
    outputTypes: ["image/png"],
    relatedTools: ["image-compressor", "image-converter"],
    keywords: l(["remove background", "background remover", "transparent png"], ["supprimer le fond", "détourer une image", "png transparent"]),
    status: "live",
  },

  /* ---------------------------------------------------------------
     PDF
     --------------------------------------------------------------- */
  {
    slug: "merge-pdf",
    category: "pdf",
    priority: "S",
    name: "Merge PDF",
    tagline: t("Several PDFs into one.", "Plusieurs PDF en un seul."),
    description: t(
      "Combine several PDF files into a single document, in the order you choose.",
      "Combinez plusieurs fichiers PDF en un seul document, dans l'ordre de votre choix.",
    ),
    processing: "client",
    inputTypes: ["application/pdf"],
    outputTypes: ["application/pdf"],
    relatedTools: ["split-pdf", "compress-pdf", "jpg-to-pdf"],
    keywords: l(["merge pdf", "combine pdf", "join pdf"], ["fusionner pdf", "combiner pdf", "assembler pdf"]),
    status: "live",
  },
  {
    slug: "split-pdf",
    category: "pdf",
    priority: "S",
    name: "Split PDF",
    tagline: t("Pull pages out of a PDF.", "Extraire des pages d'un PDF."),
    description: t(
      "Split a PDF into separate files, or extract only the pages you need.",
      "Divisez un PDF en plusieurs fichiers, ou extrayez seulement les pages voulues.",
    ),
    processing: "client",
    inputTypes: ["application/pdf"],
    outputTypes: ["application/pdf"],
    relatedTools: ["merge-pdf", "pdf-to-jpg", "compress-pdf"],
    keywords: l(["split pdf", "extract pdf pages", "separate pdf"], ["diviser pdf", "extraire des pages pdf", "séparer pdf"]),
    status: "live",
  },
  {
    slug: "compress-pdf",
    category: "pdf",
    priority: "S",
    name: "Compress PDF",
    tagline: t("Lighter PDFs, by re-encoding their images.", "Des PDF plus légers, en ré-encodant leurs images."),
    description: t(
      "Reduce the size of a PDF by re-encoding the images it contains. Very effective on scans and photo-heavy documents; text-only PDFs will gain little.",
      "Réduisez le poids d'un PDF en ré-encodant les images qu'il contient. Très efficace sur les scans et les documents riches en photos ; un PDF purement textuel gagnera peu.",
    ),
    processing: "client",
    inputTypes: ["application/pdf"],
    outputTypes: ["application/pdf"],
    relatedTools: ["merge-pdf", "split-pdf", "image-compressor"],
    keywords: l(["compress pdf", "reduce pdf size", "shrink pdf"], ["compresser pdf", "réduire la taille d'un pdf", "alléger un pdf"]),
    status: "live",
  },
  {
    slug: "jpg-to-pdf",
    category: "pdf",
    priority: "S",
    name: "JPG to PDF",
    tagline: t("Images into one PDF.", "Des images en un seul PDF."),
    description: t(
      "Turn JPG and PNG images into a single PDF, with page size and orientation options.",
      "Transformez vos images JPG et PNG en un seul PDF, avec choix du format et de l'orientation.",
    ),
    processing: "client",
    inputTypes: ["image/jpeg", "image/png"],
    outputTypes: ["application/pdf"],
    relatedTools: ["pdf-to-jpg", "merge-pdf", "image-compressor"],
    keywords: l(["jpg to pdf", "image to pdf", "png to pdf", "photos to pdf"], ["jpg en pdf", "image en pdf", "photos en pdf"]),
    status: "live",
  },
  {
    slug: "pdf-to-jpg",
    category: "pdf",
    priority: "S",
    name: "PDF to JPG",
    tagline: t("Every page as an image.", "Chaque page en image."),
    description: t(
      "Export each page of a PDF as a JPG or PNG image, at the resolution you choose.",
      "Exportez chaque page d'un PDF en image JPG ou PNG, à la résolution de votre choix.",
    ),
    processing: "client",
    inputTypes: ["application/pdf"],
    outputTypes: ["image/jpeg", "image/png"],
    relatedTools: ["jpg-to-pdf", "split-pdf", "image-compressor"],
    keywords: l(["pdf to jpg", "pdf to image", "pdf to png", "convert pdf to picture"], ["pdf en jpg", "pdf en image", "convertir pdf en photo"]),
    status: "live",
  },

  /* ---------------------------------------------------------------
     QR
     --------------------------------------------------------------- */
  {
    slug: "qr-code-generator",
    category: "qr",
    priority: "S",
    name: "QR Code Generator",
    tagline: t("Links, Wi-Fi, contacts and more.", "Liens, Wi-Fi, contacts et plus."),
    description: t(
      "Create QR codes for URLs, Wi-Fi networks, contact cards, WhatsApp, email and more, and export them as PNG or SVG.",
      "Créez des codes QR pour des URL, réseaux Wi-Fi, cartes de visite, WhatsApp, e-mail et plus, et exportez-les en PNG ou SVG.",
    ),
    processing: "client",
    outputTypes: ["image/png", "image/svg+xml"],
    relatedTools: [],
    keywords: l(["qr code generator", "wifi qr code", "vcard qr", "free qr code"], ["générateur qr code", "qr code wifi", "qr code gratuit"]),
    status: "live",
  },
  {
    slug: "ocr",
    category: "text",
    priority: "A",
    name: "OCR — Image & PDF to text",
    tagline: t("Pull the text out of a scan or a photo.", "Extraire le texte d'un scan ou d'une photo."),
    description: t(
      "Read the text inside an image or a scanned PDF and get it back as editable text. The recognition engine runs in your browser — the file never leaves your device.",
      "Lisez le texte contenu dans une image ou un PDF scanné et récupérez-le sous forme éditable. Le moteur de reconnaissance tourne dans votre navigateur — le fichier ne quitte jamais votre appareil.",
    ),
    processing: "client",
    inputTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    outputTypes: ["text"],
    relatedTools: ["pdf-to-word", "word-counter", "pdf-to-jpg"],
    keywords: l(
      ["ocr", "image to text", "photo to text", "scanned pdf to text", "extract text from image"],
      ["ocr", "image en texte", "photo en texte", "extraire le texte d'une image", "pdf scanné en texte"],
    ),
    faq: [
      {
        q: t("Does my file get uploaded?", "Mon fichier est-il envoyé quelque part ?"),
        a: t(
          "No. The recognition engine and its language data are downloaded to your browser, and the file is read locally. Nothing is sent to a server.",
          "Non. Le moteur de reconnaissance et ses données de langue sont téléchargés dans votre navigateur, et le fichier est lu localement. Rien n'est envoyé à un serveur.",
        ),
      },
      {
        q: t("Why is the first run slower?", "Pourquoi la première utilisation est-elle plus lente ?"),
        a: t(
          "The engine and the language model weigh about 14 MB and are downloaded once, then cached. Later runs start immediately.",
          "Le moteur et le modèle de langue pèsent environ 14 Mo, téléchargés une seule fois puis mis en cache. Les utilisations suivantes démarrent immédiatement.",
        ),
      },
      {
        q: t("Handwriting?", "L'écriture manuscrite ?"),
        a: t(
          "No. Tesseract reads printed text. Handwriting needs a different class of model.",
          "Non. Tesseract lit du texte imprimé. L'écriture manuscrite relève d'une autre famille de modèles.",
        ),
      },
    ],
    status: "live",
  },
  {
    slug: "pdf-to-word",
    category: "pdf",
    priority: "A",
    name: "PDF to Word",
    tagline: t("Get the text back, editable.", "Récupérer le texte, éditable."),
    description: t(
      "Extract the text of a PDF into a real .docx you can edit in Word. The layout is not reproduced — this returns the words, organised in paragraphs, not a pixel-perfect copy.",
      "Extrayez le texte d'un PDF vers un vrai .docx éditable dans Word. La mise en page n'est pas reproduite : vous récupérez les mots, organisés en paragraphes, pas une copie à l'identique.",
    ),
    processing: "client",
    inputTypes: ["application/pdf"],
    outputTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    relatedTools: ["ocr", "pdf-to-jpg", "split-pdf"],
    keywords: l(
      ["pdf to word", "pdf to docx", "convert pdf to word", "edit pdf text"],
      ["pdf en word", "pdf en docx", "convertir pdf en word", "éditer le texte d'un pdf"],
    ),
    faq: [
      {
        q: t("Is the layout preserved?", "La mise en page est-elle conservée ?"),
        a: t(
          "No, and no browser tool does it honestly. Columns, tables and images are not reconstructed. You get the text, split into paragraphs, in an editable document.",
          "Non, et aucun outil navigateur ne le fait honnêtement. Colonnes, tableaux et images ne sont pas reconstruits. Vous obtenez le texte, découpé en paragraphes, dans un document éditable.",
        ),
      },
      {
        q: t("My PDF is a scan and comes out empty.", "Mon PDF est un scan et ressort vide."),
        a: t(
          "A scan contains images, not text. Run it through the OCR tool first, then paste the result.",
          "Un scan contient des images, pas du texte. Passez-le d'abord par l'outil OCR, puis collez le résultat.",
        ),
      },
    ],
    status: "live",
  },
];

export const liveTools = tools.filter((tool) => tool.status === "live");

export function getTool(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}
