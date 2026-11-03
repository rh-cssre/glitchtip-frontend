import { describe, expect, it } from "vitest";
import { codeLanguage, highlightLines } from "./highlight-lines";

describe("codeLanguage", () => {
  it("prefers the file extension", () => {
    expect(codeLanguage("app/checkout.py", "javascript")).toBe("python");
    expect(codeLanguage("src/Cart.TSX?v=2", null)).toBe("typescript");
  });

  it("falls back to the platform, mapped to a grammar", () => {
    expect(codeLanguage("<anonymous>", "node")).toBe("javascript");
    expect(codeLanguage(null, "cocoa")).toBe("swift");
  });

  it("is null when nothing matches", () => {
    expect(codeLanguage("README", "elixir")).toBeNull();
    expect(codeLanguage(undefined, undefined)).toBeNull();
  });
});

describe("highlightLines", () => {
  it("returns one escaped HTML string per line with token spans", () => {
    const out = highlightLines(["const a = '<b>';", "return a;"], "javascript");
    expect(out).toHaveLength(2);
    expect(out![0]).toContain('<span class="token keyword">const</span>');
    expect(out![0]).toContain("&lt;b&gt;");
    expect(out![0]).not.toContain("<b>");
    expect(out![1]).toContain('<span class="token keyword">return</span>');
  });

  it("keeps a multi-line comment coloured on every line", () => {
    const out = highlightLines(["/* one", "two */", "x = 1"], "javascript");
    expect(out![0]).toContain('class="token comment"');
    expect(out![1]).toContain('class="token comment"');
    expect(out![2]).not.toContain("comment");
  });

  it("is null for an unknown language or no lines", () => {
    expect(highlightLines(["x"], null)).toBeNull();
    expect(highlightLines(["x"], "elixir")).toBeNull();
    expect(highlightLines([], "python")).toBeNull();
  });
});
