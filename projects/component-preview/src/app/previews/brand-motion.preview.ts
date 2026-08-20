import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { RevealDirective } from "projects/marketing/src/app/shared/reveal.directive";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Motion: the marketing site's one animation pattern. Documents the
 * [mktReveal] directive (a subtle fade + rise the first time a section scrolls
 * into view) and the --mkt-ease / --mkt-duration tokens that define its feel.
 *
 * The live demo drives the same 18px fade/rise manually via a Replay button:
 * the real directive intentionally no-ops above the fold, so a scroll-triggered
 * example would never fire in this preview frame. The box also carries the real
 * [mktReveal] directive to show it is the shipped component, not a copy.
 */
@Component({
  selector: "preview-brand-motion",
  imports: [RevealDirective, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      // These two mirror --mkt-ease / --mkt-duration from
      // projects/marketing/src/styles.scss. The preview app mirrors the
      // --mkt-space-* / layout tokens but not the motion pair, so we restate
      // them here to reproduce the exact reveal feel. KEEP IN SYNC.
      :host {
        --demo-ease: cubic-bezier(0.22, 1, 0.36, 1);
        --demo-duration: 0.6s;
      }
      .bm-stage {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--gt-space-4);
      }
      .bm-replay {
        appearance: none;
        cursor: pointer;
        border: 1px solid var(--mat-sys-outline-variant);
        background-color: var(--mat-sys-surface-container-high);
        color: var(--mat-sys-on-surface);
        border-radius: 8px;
        padding: var(--gt-space-2) var(--gt-space-4);
        font: var(--mat-sys-label-large);

        &:hover {
          background-color: var(--mat-sys-secondary-container);
          color: var(--mat-sys-on-secondary-container);
        }
      }
      // The reveal itself: opacity + transform only, GPU-composited, driven by
      // the two motion tokens. This is the exact CSS that .is-reveal ships on
      // the marketing site.
      .bm-card {
        opacity: 0;
        transform: translateY(18px);
        transition:
          opacity var(--demo-duration) var(--demo-ease),
          transform var(--demo-duration) var(--demo-ease);
        will-change: opacity, transform;

        width: 100%;
        max-width: 420px;
        padding: var(--gt-space-5);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 12px;
        background-color: var(--mat-sys-surface-container-low);
      }
      .bm-card--in {
        opacity: 1;
        transform: none;
        will-change: auto;
      }
      .bm-card__title {
        font: var(--mat-sys-title-medium);
        margin: 0 0 var(--gt-space-1);
      }
      .bm-card__body {
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
      }
      @media (prefers-reduced-motion: reduce) {
        .bm-card {
          opacity: 1;
          transform: none;
          transition: none;
        }
      }
      .bm-tokens {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: var(--gt-space-2) var(--gt-space-5);
        margin: 0;
      }
      .bm-tokens dt {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.82rem;
        color: var(--mat-sys-on-surface);
      }
      .bm-tokens dd {
        margin: 0;
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Motion"
      status="stable"
      description="Marketing has exactly one motion pattern: [mktReveal], a subtle fade + 18px rise the first time a section scrolls into view. --mkt-ease and --mkt-duration are the shared tokens for every reveal, float, and hover. This is a deliberate product-vs-marketing split: the product ships no scroll animation; marketing adds reveal to give a long landing page a sense of pace."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="Never put meaning in motion alone: a reveal is decoration, so every section is fully readable with no motion at all. The directive honors prefers-reduced-motion (content simply appears) and never runs during prerender, so no-JS and crawlers get every section visible. Above-the-fold content is never hidden, so nothing flashes in on load."
      [api]="api"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">The reveal</div>
        <p class="preview-section__note">
          Fade from 0 and rise 18px, once, on the two motion tokens. Press
          Replay to re-run it. On the live site it fires when the section
          scrolls into view. The box carries the real
          <code>[mktReveal]</code> directive, which correctly no-ops here
          because it sits above the fold.
        </p>
        <div class="bm-stage">
          <button
            type="button"
            class="bm-replay"
            (click)="replay()"
          >
            Replay
          </button>
          <div
            mktReveal
            class="bm-card"
            [class.bm-card--in]="shown()"
          >
            <p class="bm-card__title">Ship faster, break less</p>
            <p class="bm-card__body">
              A section like this fades and rises the first time it enters the
              viewport, then stays put. One observer, disconnected after the
              first reveal.
            </p>
          </div>
        </div>
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">Motion tokens</div>
        <p class="preview-section__note">
          One place for timing and easing. Every reveal, float, and hover on the
          site references these, so timing and easing stay identical everywhere.
        </p>
        <dl class="bm-tokens">
          <dt>--mkt-ease</dt>
          <dd>cubic-bezier(0.22, 1, 0.36, 1), a soft ease-out</dd>
          <dt>--mkt-duration</dt>
          <dd>0.6s, the standard reveal length</dd>
        </dl>
      </div>
    </preview-doc>
  `,
})
export class BrandMotionPreview {
  readonly shown = signal(true);

  replay(): void {
    this.shown.set(false);
    // Let the browser paint the hidden state before re-adding, so the
    // transition actually re-runs instead of being coalesced away.
    setTimeout(() => this.shown.set(true), 60);
  }

  readonly whenToUse = [
    "Major sections of a marketing page as they scroll into view (hero band, feature rows, closing CTA)",
    "One reveal per section wrapper, not per element inside it",
  ];
  readonly dos = [
    "Wrap a whole section in a single [mktReveal] so it reveals as one unit",
    "Let --mkt-ease and --mkt-duration own the feel; change motion there, never per element",
    "Keep every section fully readable and functional with no motion at all",
    "Trust the above-the-fold no-op: the hero and anything in view on load must never hide and flash in",
  ];
  readonly donts = [
    "Stagger [mktReveal] onto many children of one section (many observers, jittery cascade)",
    "Animate anything the reader needs to act on before it finishes",
    "Encode meaning, order, or state in the motion; it is pure decoration",
    "Reach for a second motion system; reveal + the two tokens is the whole vocabulary",
  ];
  readonly content = [
    "Reveal is a pace cue, not a message; copy must read the same whether or not it animated",
  ];
  readonly api: ApiRow[] = [
    { name: "mktReveal", type: "attribute directive", default: "", description: "Add to a section element to fade + rise it on first scroll-in; no bindings" },
    { name: "--mkt-ease", type: "cubic-bezier", default: "cubic-bezier(0.22, 1, 0.36, 1)", description: "Shared easing for every reveal, float, and hover" },
    { name: "--mkt-duration", type: "time", default: "0.6s", description: "Shared reveal length" },
  ];
  readonly code = `import { RevealDirective } from "../shared/reveal.directive";

// standalone component
imports: [RevealDirective],

<!-- one directive per section wrapper -->
<section mktReveal class="feature-band">
  <h2 class="marketing-heading">Ship faster, break less</h2>
  <!-- ... -->
</section>`;
}
