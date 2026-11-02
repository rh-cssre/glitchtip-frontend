import { Component, ChangeDetectionStrategy } from "@angular/core";
import { SectionHeaderComponent } from "projects/marketing/src/app/shared/section-header/section-header.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * The reusable centered section header for marketing pages: an eyebrow label, a
 * `.fancy` title, and an optional muted subtitle. It exists so every section
 * opens with the same rhythm instead of each page hand-rolling its own eyebrow
 * and heading pairing.
 */
@Component({
  selector: "preview-brand-section-header",
  imports: [SectionHeaderComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bsh-stack {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-6);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Section header"
      status="stable"
      description="A centered eyebrow + title + optional subtitle that opens a marketing section. Reuse it so every section opens with the same rhythm. The title uses .fancy on the marketing-subheading scale, capped at ~46ch and centered."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      anatomy="eyebrow:   uppercase primary label (optional)
title:     .fancy marketing-subheading, always present
subtitle:  muted marketing-body, one or two lines (optional)"
      a11y="The title renders as a real <h2>, so it must be the section's heading in document order. Do not nest two section headers under one section, and keep the page's single <h1> in the hero above it."
      [api]="api"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Full: eyebrow, title, subtitle</div>
        <div class="bsh-stack">
          <mkt-section-header
            eyebrow="Cost calculator"
            title="What are you paying to watch your errors?"
            subtitle="Drag to your monthly event volume and compare it against a flat GlitchTip plan."
          />
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">No subtitle</div>
        <p class="preview-section__note">
          Drop the subtitle when the eyebrow and title already carry the whole
          idea. The title stays on the same scale.
        </p>
        <div class="bsh-stack">
          <mkt-section-header
            eyebrow="Built for teams"
            title="Everything your whole team needs, in one place"
          />
        </div>
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">Title only</div>
        <p class="preview-section__note">
          The eyebrow is optional too; a bare title still gets the centered,
          capped rhythm.
        </p>
        <div class="bsh-stack">
          <mkt-section-header title="Trusted by developers who ship" />
        </div>
      </div>
    </preview-doc>
  `,
})
export class BrandSectionHeaderPreview {
  readonly whenToUse = [
    "Opening any marketing section that needs a heading",
    "Introducing a band of cards, a calculator, a comparison, or a feature grid",
  ];
  readonly dos = [
    "Reuse mkt-section-header instead of hand-rolling an eyebrow + heading per page",
    "Keep it centered. The component caps the title at ~46ch and centers it",
    "Use one section header per section, as its single heading",
    "Keep the eyebrow to a short 1-3 word label; keep the subtitle to one or two lines",
  ];
  readonly donts = [
    "Left-align it or override the width cap for a one-off layout",
    "Stack two section headers in the same section",
    "Put a sentence in the eyebrow; it is an uppercase label, not a subtitle",
    "Repeat the title's words in the subtitle instead of adding context",
  ];
  readonly content = [
    "Eyebrow: an uppercase category label (Cost calculator, Built for teams)",
    "Title: the section's one claim, sentence case, no trailing period",
    "Subtitle: the supporting line. Add context the title does not already state",
  ];
  readonly api: ApiRow[] = [
    { name: "eyebrow", type: "string", default: "\"\"", description: "Uppercase primary label above the title; omitted when empty" },
    { name: "title", type: "string", default: "\"\"", description: "The section heading (.fancy marketing-subheading); rendered as an <h2>" },
    { name: "subtitle", type: "string", default: "\"\"", description: "One muted supporting line below the title; omitted when empty" },
  ];
  readonly code = `<mkt-section-header
  eyebrow="Cost calculator"
  title="What are you paying to watch your errors?"
  subtitle="Drag to your monthly event volume." />`;
}
