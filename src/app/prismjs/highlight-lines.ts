import Prism from "./languages";
import { EXTENSION_GRAMMARS, GRAMMAR_MAPPINGS } from "./constants";

function grammar(language: string | null | undefined) {
  if (!language) return undefined;
  const g = Prism.languages[language];
  return g && typeof g === "object" ? (g as Prism.Grammar) : undefined;
}

/** Grammar from the file extension, else the event platform; null is plain text. */
export function codeLanguage(
  filename: string | null | undefined,
  platform: string | null | undefined,
): string | null {
  const ext = filename
    ?.split(/[?#]/)[0]
    .match(/\.([a-z0-9]+)$/i)?.[1]
    ?.toLowerCase();
  const fromExt = ext ? EXTENSION_GRAMMARS[ext] : undefined;
  if (grammar(fromExt)) return fromExt!;
  const fromPlatform = platform
    ? (GRAMMAR_MAPPINGS[platform] ?? platform)
    : null;
  return grammar(fromPlatform) ? fromPlatform : null;
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * One HTML string per line, tokenised as one block so multi-line strings stay
 * coloured. Null for an unknown language, so callers show plain text.
 */
export function highlightLines(
  lines: string[],
  language: string | null,
): string[] | null {
  const g = grammar(language);
  if (!g || !lines.length) return null;
  const out = [""];
  const walk = (stream: Prism.TokenStream, cls: string) => {
    if (typeof stream === "string") {
      stream.split("\n").forEach((part, i) => {
        if (i) out.push("");
        if (part) {
          const text = escape(part);
          out[out.length - 1] += cls
            ? `<span class="${cls}">${text}</span>`
            : text;
        }
      });
    } else if (Array.isArray(stream)) {
      stream.forEach((t) => walk(t, cls));
    } else {
      const alias = stream.alias ? ([] as string[]).concat(stream.alias) : [];
      walk(stream.content, ["token", stream.type, ...alias].join(" "));
    }
  };
  walk(Prism.tokenize(lines.join("\n"), g), "");
  return out.length === lines.length ? out : null;
}
