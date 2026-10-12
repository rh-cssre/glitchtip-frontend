import { Component, ChangeDetectionStrategy } from "@angular/core";
import { PageShellComponent } from "projects/marketing/src/app/shared/page-shell/page-shell.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * The card-less marketing page wrapper. Every marketing page except full-width
 * bands sits in exactly one `mkt-page-shell`: a single centered, width-capped
 * column on the page's dot-grid background. It has no inputs; you compose the
 * page's own blocks (section-header, divider, markdown) inside it.
 */
@Component({
  selector: "preview-brand-page-shell",
  imports: [PageShellComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      // Sample content standing in for a real page's blocks so the shell's
      // centered, width-capped column reads on its own.
      .bps-sample {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-3);
      }
      // Type comes from the marketing tiers on the elements; only layout and
      // the muted body color are contextual.
      .bps-sample h3 {
        margin: 0;
      }
      .bps-sample p {
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
        max-width: 60ch;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Page shell"
      status="stable"
      description="The standard marketing page wrapper. Every marketing page except full-width bands sits in one mkt-page-shell: a card-less, centered, width-capped column on the page's dot-grid background. It replaces the old hero-container + big-card + centered-block boilerplate each page used to hand-roll."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The shell is a plain layout container with no role or focus behavior of its own; keep the page's heading order (one h1, then sections) in the content you project into it."
      [anatomy]="anatomy"
      [api]="api"
      [code]="code"
      [composition]="composition"
    >
      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">The centered column</div>
        <p class="preview-section__note">
          The shell caps and centers whatever it wraps. Here it holds a heading
          and a line of body copy; a real page would compose a section-header,
          dividers, and content blocks in the same column.
        </p>
        <mkt-page-shell>
          <div class="bps-sample">
            <h3 class="marketing-subheading">
              Error tracking without the surprise bill
            </h3>
            <p class="marketing-body">
              Everything in the shell sits in one centered column that never
              exceeds 1800px and keeps a gutter on every viewport. The page
              supplies its own blocks; the shell only frames them.
            </p>
          </div>
        </mkt-page-shell>
      </div>
    </preview-doc>
  `,
})
export class BrandPageShellPreview {
  readonly whenToUse = [
    "The outermost wrapper of any standard marketing page",
    "Any page whose content should read as one centered, width-capped column",
  ];
  readonly dos = [
    "Use exactly one shell per page, as the outermost element",
    "Compose the page's own blocks (mkt-section-header, .divider, markdown) inside it",
    "Let a genuinely full-width band (edge-to-edge hero, colored banner) sit outside the shell",
  ];
  readonly donts = [
    "Nest one shell inside another",
    "Re-add a mat-card / big-card wrapper inside the shell (it is intentionally card-less)",
    "Hand-roll the width cap or centering on the page; the shell owns it",
    "Reach for the shell to constrain a single component; it is a page-level wrapper",
  ];
  readonly anatomy = `mkt-page-shell            (width min(95%, 100% - 48px), max 1800px, centered)
  └─ page content         (section-header, dividers, markdown, blocks)`;
  readonly api: ApiRow[] = [
    { name: "(none)", type: "", default: "", description: "No inputs. The shell is configured entirely by the content projected into it." },
  ];
  readonly composition = {
    contains: ["Section header", "any marketing content blocks"],
  };
  readonly code = `<mkt-page-shell>
  <mkt-section-header eyebrow="Pricing" title="Simple, honest plans" />
  <div class="divider"></div>
  <!-- page content -->
</mkt-page-shell>`;
}
