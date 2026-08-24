import { Component, ChangeDetectionStrategy } from "@angular/core";

/**
 * Accessibility standards. The per-component pages carry a specific a11y note;
 * this page states the target and the baseline that every component is held
 * to, so those notes can stay short.
 */
@Component({
  selector: "preview-foundations-accessibility",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .a11y-target {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-1);
        padding: var(--gt-space-4);
        border-radius: 8px;
        background-color: var(--info-container);
        color: var(--on-info);
        max-width: 640px;
        margin-bottom: var(--gt-space-5);
      }
      .a11y-target__level {
        font: var(--mat-sys-title-medium);
      }
      .a11y-list {
        margin: 0;
        list-style: disc outside;
        padding-left: var(--gt-space-5);
        font: var(--mat-sys-body-medium);
      }
      .a11y-list li {
        margin-bottom: var(--gt-space-2);
        padding-left: var(--gt-space-1);
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Accessibility</h1>
      <p class="preview-lead">
        The standard every component is built to, and how we check it. This
        page is public, so treat it as our stated commitment.
      </p>
    </header>

    <div class="a11y-target">
      <span class="a11y-target__level">Target: WCAG 2.1 AA</span>
      <span>New and updated UI is built to meet WCAG 2.1 Level AA.</span>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Color and contrast</div>
      <ul class="a11y-list">
        <li>Body text meets 4.5:1 against its background; large text and UI or graphic parts meet 3:1.</li>
        <li>Never rely on color alone. Pair it with an icon, text, or shape, so state reads without color perception.</li>
        <li>Check both light and dark. Contrast that passes in one scheme can fail in the other; the Colors page shows on-color pairings for a quick look.</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Keyboard</div>
      <ul class="a11y-list">
        <li>Every interactive control is reachable and operable by keyboard alone.</li>
        <li>Focus is always visible, and tab order follows the reading order (left to right, top to bottom).</li>
        <li>No keyboard traps. Dialogs trap focus while open and return it on close.</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Screen readers</div>
      <ul class="a11y-list">
        <li>Use real semantics: one h1 per page, real headings, real buttons and links.</li>
        <li>Icon-only buttons need an aria-label that names the action.</li>
        <li>Form fields tie their label, input, and error together (mat-form-field does this), so errors are announced on the field, not in a toast.</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Motion</div>
      <ul class="a11y-list">
        <li>Use Material's built-in transitions; do not hand-author animation without a reason.</li>
        <li>Respect prefers-reduced-motion: reduce or remove non-essential animation when it is set.</li>
        <li>Never convey information through motion alone.</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Targets</div>
      <ul class="a11y-list">
        <li>Give controls an adequate hit area. Icon buttons use the two standard sizes (24 in rows and inputs, 36 in toolbars) with their padding, not smaller.</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">How we test</div>
      <ul class="a11y-list">
        <li>Tab through the whole flow with no mouse, and confirm focus is visible and ordered.</li>
        <li>Run a contrast check on new color pairings in both schemes.</li>
        <li>Spot-check with a screen reader that names, states, and errors are announced.</li>
        <li>Run an automated pass (axe or IBM Equal Access) to catch the mechanical failures.</li>
      </ul>
    </div>
  `,
})
export class FoundationsAccessibilityPreview {}
