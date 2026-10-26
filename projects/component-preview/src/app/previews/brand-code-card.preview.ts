import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CodeCardComponent } from "projects/marketing/src/app/shared/code-card/code-card.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Marketing code card: a bordered surface with a filename chip, a copy
 * button, and a projected code body. The shared snippet primitive across the
 * marketing site and docs for paste-ready config and install steps.
 */
@Component({
  selector: "preview-brand-code-card",
  imports: [CodeCardComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bcc-row {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-4);
        max-width: 560px;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Code card"
      status="stable"
      description="A bordered snippet surface: a monospace filename chip on the left, a copy button on the right, and a projected code body. Used across marketing and docs for paste-ready config and install steps."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The copy button is a real focusable button with an aria-label built from the filename (e.g. 'Copy .env'). It only renders when copyText is set, so there is never a focusable control that does nothing."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Examples</div>
        <p class="preview-section__note">
          The projected content is a plain <code>&lt;pre&gt;</code>; the card
          supplies the frame, filename chip, and copy affordance. Set
          <code>copyText</code> to the exact string that lands on the clipboard.
        </p>
        <div class="bcc-row">
          <mkt-code-card
            filename=".env"
            copyText="SENTRY_DSN=https://key@app.glitchtip.com/1"
          >
            <pre>SENTRY_DSN=https://key&#64;app.glitchtip.com/1</pre>
          </mkt-code-card>
          <mkt-code-card filename="Terminal" copyText="npm install @sentry/browser">
            <pre>npm install &#64;sentry/browser</pre>
          </mkt-code-card>
        </div>
      </div>
    </preview-doc>
  `,
})
export class BrandCodeCardPreview {
  readonly whenToUse = [
    "Any paste-ready snippet on the marketing site or docs: DSN, .env, install command",
    "Config the reader is meant to copy verbatim into their project",
  ];
  readonly dos = [
    "Give the card a filename that names what the snippet is (.env, Terminal, sentry.config.ts)",
    "Set copyText to the exact string the reader should copy",
    "Project a single <pre> so line breaks and indentation are preserved",
  ];
  readonly donts = [
    "Set copyText to something different from what's shown in the body",
    "Wrap prose or a paragraph in a code card; it is for code only",
    "Leave copyText empty when the snippet is meant to be copied (the copy button won't render)",
  ];
  readonly api: ApiRow[] = [
    { name: "filename", type: "string", default: "\"\"", description: "Monospace chip label in the header, e.g. .env or Terminal" },
    { name: "copyText", type: "string", default: "\"\"", description: "Exact string copied to the clipboard; the copy button only renders when this is set" },
    { name: "(content)", type: "projected", default: "", description: "The code body; project a single <pre> element" },
  ];
  readonly importCode = `import { CodeCardComponent } from "projects/marketing/src/app/shared/code-card/code-card.component";`;
  readonly code = `<mkt-code-card filename=".env" [copyText]="dsn">
  <pre>SENTRY_DSN={{ dsn }}</pre>
</mkt-code-card>`;
}
