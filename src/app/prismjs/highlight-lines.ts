import Prism from "prismjs";
// Prism core ships markup, css, clike and javascript; the rest load here.
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-c";
import "prismjs/components/prism-objectivec";
import { GRAMMAR_MAPPINGS } from "./constants";

const EXTENSIONS: Record<string, string> = {
  py: "python",
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  mts: "typescript",
  java: "java",
  rb: "ruby",
  php: "php",
  go: "go",
  rs: "rust",
  swift: "swift",
  c: "c",
  h: "c",
  m: "objectivec",
  cs: "csharp",
  json: "json",
};

function grammar(language: string | null | undefined) {
  if (!language) return undefined;
  const g = Prism.languages[language];
  return g && typeof g === "object" ? (g as Prism.Grammar) : undefined;
}

/**
 * Prism language for a source file: the file extension first, then the
 * event platform (node -> javascript, cocoa -> swift). Null means plain text.
 */
export function codeLanguage(
  filename: string | null | undefined,
  platform: string | null | undefined,
): string | null {
  const ext = filename
    ?.split(/[?#]/)[0]
    .match(/\.([a-z0-9]+)$/i)?.[1]
    ?.toLowerCase();
  const fromExt = ext ? EXTENSIONS[ext] : undefined;
  if (grammar(fromExt)) return fromExt!;
  const fromPlatform = platform
    ? (GRAMMAR_MAPPINGS[platform] ?? platform)
    : null;
  return grammar(fromPlatform) ? fromPlatform : null;
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Tokenises the lines as one block, so multi-line strings and comments stay
 * coloured, and returns one HTML string per line (spans with Prism token
 * classes). Null when the language is unknown, so callers show plain text.
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
