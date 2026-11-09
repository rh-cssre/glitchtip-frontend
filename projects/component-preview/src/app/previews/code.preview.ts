import { Component, ChangeDetectionStrategy } from "@angular/core";
import { codeLanguage, highlightLines } from "src/app/prismjs/highlight-lines";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

const FIRST_LINE = 40;
const CRASH_LINE = 43;
const SOURCE = [
  "def total(cart):",
  '    """Sum the cart, in cents."""',
  "    prices = [item.price for item in cart.items]",
  "    return sum(prices) / len(prices)",
  "",
  "TAX_RATE = 0.2",
];
const INSTALL = `import { init } from "./monitoring";

init({ dsn: "https://key@glitchtip.example.com/1", sampleRate: 1.0 });`;

@Component({
  selector: "preview-code",
  imports: [PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <preview-doc
      title="Code"
      status="stable"
      description="Source context and code blocks on the strip tint, with a token theme that follows light and dark. Token colours come from the log palette and keep 4.5:1 on the code surface and on the crash line. The crash line gets an error tint and a 2px error bar."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="Line numbers are not selectable, so copied code has none. The crash line is marked by its bar as well as its tint, and the line number is in the frame's text too. A block that scrolls sideways is focusable (tabindex 0) so it can scroll from the keyboard."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title"
          >Source context with the crash line</div
        >
        <div class="gt-code" tabindex="0">
          <div class="gt-code__lines">
            @for (line of lines; track line.n) {
              <div
                class="gt-code__line"
                [class.gt-code__line--hl]="line.n === crashLine"
              >
                <span class="gt-code__n">{{ line.n }}</span>
                <span [innerHTML]="line.html"></span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Markdown code block</div>
        <pre><code class="language-javascript" [innerHTML]="install"></code></pre>
      </div>
    </preview-doc>
  `,
})
export class CodePreview {
  readonly crashLine = CRASH_LINE;
  private readonly html =
    highlightLines(SOURCE, codeLanguage("cart/pricing.py", "python")) ?? SOURCE;
  readonly lines = SOURCE.map((_, i) => ({
    n: FIRST_LINE + i,
    html: this.html[i],
  }));
  readonly install = (
    highlightLines(INSTALL.split("\n"), "javascript") ?? []
  ).join("\n");

  readonly whenToUse = [
    "A frame's source context, with its crash line",
    "SDK snippets and other code in rendered markdown",
  ];
  readonly dos = [
    "Pick the grammar with codeLanguage(filename, platform)",
    "Fall back to plain text when highlightLines returns null",
    "Keep raw traces plain; they are not source",
  ];
  readonly donts = [
    "Import a stock Prism theme; the token theme is global",
    "Bold or recolour the crash line's text",
  ];
  readonly api: ApiRow[] = [
    {
      name: "codeLanguage(filename, platform)",
      type: "string | null",
      description:
        "Grammar from the extension, then the platform; null is plain",
    },
    {
      name: "highlightLines(lines, language)",
      type: "string[] | null",
      description:
        "One HTML string per line; multi-line strings and comments keep colour",
    },
    {
      name: ".gt-code > .gt-code__lines > .gt-code__line",
      type: "class",
      description: "Numbered lines; add --hl to the crash line",
    },
    {
      name: ".gt-code__n",
      type: "class",
      description: "Muted line number",
    },
    {
      name: "--gt-code-*",
      type: "token",
      description: "bg, text, muted, keyword, string, function, number, crash",
    },
  ];
  readonly importCode = `import { codeLanguage, highlightLines } from "src/app/prismjs/highlight-lines";`;
  readonly code = `<div class="gt-code" tabindex="0">
  <div class="gt-code__lines">
    @for (l of context; track l[0]; let i = $index) {
      <div class="gt-code__line" [class.gt-code__line--hl]="l[0] === lineNo">
        <span class="gt-code__n">{{ l[0] }}</span>
        <span [innerHTML]="html[i]"></span>
      </div>
    }
  </div>
</div>`;
}
