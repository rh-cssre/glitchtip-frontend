import { Component, ChangeDetectionStrategy } from "@angular/core";

/**
 * The guide's front door: what this is, how to read a page, and what the
 * status chips mean. Registered first so it is the default landing view.
 */
@Component({
  selector: "preview-overview",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .ov-list {
        margin: 0;
        list-style: disc outside;
        padding-left: var(--gt-space-5);
        font: var(--mat-sys-body-medium);
      }
      .ov-list li {
        margin-bottom: var(--gt-space-2);
        padding-left: var(--gt-space-1);
      }
      .ov-legend {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-4);
        max-width: 640px;
      }
      .ov-legend__row {
        display: flex;
        align-items: baseline;
        gap: var(--gt-space-4);
      }
      .ov-chip {
        flex: none;
        min-width: 92px;
        text-align: center;
        font: var(--mat-sys-label-small);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        padding: 2px 8px;
        border-radius: 4px;
      }
      .ov-chip--stable {
        background-color: var(--success-container);
        color: var(--on-success);
      }
      .ov-chip--legacy {
        background-color: var(--warning-container);
        color: var(--on-warning);
      }
      .ov-chip--deprecated {
        background-color: var(--mat-sys-error);
        color: var(--mat-sys-on-error);
      }
      .ov-chip--note {
        background-color: var(--mat-sys-surface-container-high);
        color: var(--mat-sys-on-surface-variant);
        border: 1px solid var(--mat-sys-outline-variant);
        text-transform: none;
        letter-spacing: normal;
      }
      .ov-legend__text {
        font: var(--mat-sys-body-medium);
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">GlitchTip design system</h1>
      <p class="preview-lead">
        The living rulebook for how GlitchTip looks and behaves. It renders the
        real components and reads token values live from the running theme, so
        it cannot drift from the app.
      </p>
    </header>

    <div class="preview-section">
      <div class="preview-section__title">How this works</div>
      <ul class="ov-list">
        <li>This guide defines how each pattern should look and behave. It is the reference the product follows.</li>
        <li>When the product does not match a rule yet, that is a tracked ticket in the design audit, not a reason to soften the rule.</li>
        <li>Foundations (color, type, spacing) read live from the theme, so they are always accurate.</li>
        <li>Two sections live in the toolbar: Product (the app) and Brand (the marketing site).</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">How to read a page</div>
      <p class="preview-section__note">
        Component and pattern pages follow the same order, so you always know
        where to look:
      </p>
      <ul class="ov-list">
        <li>What it is, then a live example you can interact with.</li>
        <li>When to use, Do, and Don't.</li>
        <li>Writing, accessibility, and keyboard notes, where they apply.</li>
        <li>Anatomy and Relationships (what it sits inside and what it holds).</li>
        <li>Properties and a copyable usage snippet of the real component.</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">What the status chips mean</div>
      <p class="preview-section__note">
        Each component carries a lifecycle status. It reports the state of the
        real code, so it is a measured fact, not a label.
      </p>
      <div class="ov-legend">
        <div class="ov-legend__row">
          <span class="ov-chip ov-chip--stable">stable</span>
          <span class="ov-legend__text">Current conventions, reviewed, safe to use.</span>
        </div>
        <div class="ov-legend__row">
          <span class="ov-chip ov-chip--legacy">legacy</span>
          <span class="ov-legend__text">Works and is supported, but predates current conventions and is slated for an update. Fine to use; expect changes.</span>
        </div>
        <div class="ov-legend__row">
          <span class="ov-chip ov-chip--deprecated">deprecated</span>
          <span class="ov-legend__text">Do not use in new code; the page names the replacement.</span>
        </div>
        <div class="ov-legend__row">
          <span class="ov-chip ov-chip--note">visual refresh planned</span>
          <span class="ov-legend__text">A neutral design note, separate from the code status: the code may be current while the visuals are not yet on-system.</span>
        </div>
      </div>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Adding a page</div>
      <p class="preview-section__note">
        Add an entry to the registry and, for a component, wrap the example in
        the shared preview-doc so it inherits the section order. The full recipe
        (which sections are required, the plain-voice rule) lives in DESIGN.md.
      </p>
    </div>
  `,
})
export class OverviewPreview {}
