/**
 * Analyse JSON avec localisation de l'erreur.
 *
 * `JSON.parse` ne signale qu'une position en caractères, et seulement dans le
 * texte du message — et pas dans le même format selon les moteurs. On la
 * convertit ici en ligne et colonne, la seule information réellement
 * exploitable quand on cherche l'erreur dans un document de 400 lignes.
 */
export type JsonParseResult =
  | { ok: true; value: unknown }
  | { ok: false; message: string; line?: number; column?: number };

export function parseJson(input: string): JsonParseResult {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const match = message.match(/position (\d+)/i);
    if (!match) return { ok: false, message };

    const position = Number(match[1]);
    const before = input.slice(0, position);
    const line = before.split("\n").length;
    const column = position - before.lastIndexOf("\n");
    return { ok: false, message, line, column };
  }
}

export function formatJson(input: string, indent: number): JsonParseResult & { output?: string } {
  const parsed = parseJson(input);
  if (!parsed.ok) return parsed;
  return {
    ...parsed,
    output: indent === 0 ? JSON.stringify(parsed.value) : JSON.stringify(parsed.value, null, indent),
  };
}
