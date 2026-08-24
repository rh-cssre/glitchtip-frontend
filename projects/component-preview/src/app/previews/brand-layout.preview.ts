import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { resolveCssVar } from "../foundations/tokens";
import { ThemeStore } from "../theme-store";

interface ResolvedContainer {
  name: string;
  usage: string;
  value: string;
  /** Bar width as a percent of the widest container, for the scaled preview. */
  pct: number;
}

interface ResolvedSpace {
  name: string;
  value: string;
  px: number;
}

/**
 * The marketing layout system: container widths, the single shared gutter
 * formula, the 4px spacing scale, and section rhythm. Values are read live
 * from the mirrored --mkt-* tokens so the reference stays honest. This is the
 * marketing counterpart of the product's Spacing/Layout foundations page; the
 * deliberate differences are a wider canvas and a larger vertical rhythm.
 */
@Component({
  selector: "preview-brand-layout",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bl-cont-row {
        display: flex;
        align-items: center;
        gap: var(--gt-space-4);
        margin-bottom: var(--gt-space-3);
      }
      .bl-cont-name {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.78rem;
        min-width: 210px;
        flex: none;
      }
      .bl-cont-track {
        flex: 1;
        min-width: 0;
      }
      .bl-cont-bar {
        height: 20px;
        border-radius: 3px;
        background-color: var(--mkt-accent-blue);
        opacity: 0.85;
      }
      .bl-cont-meta {
        display: flex;
        align-items: baseline;
        gap: var(--gt-space-2);
        margin-top: var(--gt-space-1);
      }
      .bl-cont-value {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.72rem;
        color: var(--mat-sys-on-surface);
      }
      .bl-cont-use {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }

      // Gutter diagram: an outer viewport strip with the content column
      // centered inside it, so the two symmetric gutters read at a glance.
      .bl-gutter {
        border: 1px dashed var(--mat-sys-outline-variant);
        border-radius: 6px;
        padding: var(--gt-space-3) 0;
        background-color: var(--mat-sys-surface-container-lowest, var(--mat-sys-background));
      }
      .bl-gutter-col {
        width: min(95%, 100% - var(--mkt-gutter));
        margin-inline: auto;
        height: 44px;
        border-radius: 4px;
        background-color: var(--mkt-accent-blue);
        opacity: 0.85;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.72rem;
      }

      .bl-space-row {
        display: flex;
        align-items: center;
        gap: var(--gt-space-4);
        margin-bottom: 10px;
      }
      .bl-space-name {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.78rem;
        min-width: 130px;
      }
      .bl-space-bar {
        height: 16px;
        border-radius: 2px;
        background-color: var(--mkt-accent-blue);
        opacity: 0.85;
      }
      .bl-space-value {
        font-size: 0.75rem;
        color: var(--mat-sys-on-surface-variant);
      }

      .bl-rhythm {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-2);
      }
      .bl-rhythm-band {
        border-radius: 6px;
        border: 1px solid var(--mat-sys-outline-variant);
        background-color: var(--mat-sys-surface-container-low);
        padding-block: var(--mkt-section);
        text-align: center;
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.72rem;
        color: var(--mat-sys-on-surface-variant);
      }
      .bl-divider {
        height: 1px;
        border: none;
        margin: 0;
        background-color: var(--mat-sys-outline-variant);
      }
      .bl-token-table {
        border-collapse: collapse;
        font: var(--mat-sys-body-small);
        min-width: 420px;
      }
      .bl-token-table th,
      .bl-token-table td {
        text-align: left;
        padding: var(--gt-space-2) var(--gt-space-3);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
        vertical-align: top;
      }
      .bl-token-table th {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
      }
      .bl-token-table code {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.85em;
      }
      .bl-sidepattern-demo {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        min-height: 180px;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 6px;
        overflow: hidden;
        background-color: var(--mat-sys-surface-container-low);
      }
      .bl-sidepattern-band {
        width: 96px;
        background-image: url("/static/assets/patterns/side-pattern.webp");
        background-size: 140px auto;
        -webkit-mask-image: linear-gradient(to right, #000 20%, transparent 100%);
        mask-image: linear-gradient(to right, #000 20%, transparent 100%);
        opacity: 0.6;
      }
      .bl-sidepattern-band--right {
        transform: scaleX(-1);
      }
      .bl-sidepattern-col {
        align-self: center;
        flex: 0 1 420px;
        text-align: center;
        padding: var(--gt-space-4);
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.72rem;
        color: var(--mat-sys-on-surface-variant);
        border-inline: 1px dashed var(--mat-sys-outline-variant);
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Layout</h1>
      <p class="preview-lead">
        How marketing pages size and space themselves: five container widths,
        one shared gutter, a 4px spacing scale, and a section rhythm. Every
        band picks one width and inherits the same edge, so pages line up down
        the whole site. This mirrors the product's spacing foundations on a
        deliberately wider canvas with a larger vertical rhythm.
      </p>
    </header>

    <div class="preview-section">
      <div class="preview-section__title">Container widths</div>
      <p class="preview-section__note">
        Every page and band picks exactly one of these max-widths
        (<code>--mkt-container-*</code>). Bars are scaled to the widest.
      </p>
      @for (c of containers(); track c.name) {
        <div>
          <div class="bl-cont-row">
            <span class="bl-cont-name">{{ c.name }}</span>
            <span class="bl-cont-track">
              <span class="bl-cont-bar" [style.width.%]="c.pct"></span>
            </span>
          </div>
          <div class="bl-cont-meta" style="margin-left: 226px">
            <span class="bl-cont-value">{{ c.value }}</span>
            <span class="bl-cont-use">{{ c.usage }}</span>
          </div>
        </div>
      }
    </div>

    <div class="preview-section">
      <div class="preview-section__title">The shared gutter</div>
      <p class="preview-section__note">
        Whichever width a band picks, it centers with one formula:
        <code>width: min(95%, 100% - var(--mkt-gutter)); margin-inline: auto</code>.
        The gutter is <code>--mkt-gutter</code> (48px), split symmetrically. On
        narrow viewports the <code>95%</code> arm wins (a percentage gutter);
        on wide ones the fixed <code>48px</code> arm caps it. Because every band
        shares this rule, their left and right edges align down the page
        regardless of which max-width each one uses.
      </p>
      <div class="bl-gutter">
        <div class="bl-gutter-col">content column</div>
      </div>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Spacing scale</div>
      <p class="preview-section__note">
        4px base grid, exposed as <code>--mkt-space-1</code> through
        <code>--mkt-space-9</code>. Use these for gaps and padding instead of
        ad-hoc pixels so rhythm stays on one grid. Note the base step is 4px,
        half the product's 8px grid, giving marketing finer control at small
        sizes while the large steps stay generous.
      </p>
      @for (s of spaces(); track s.name) {
        <div class="bl-space-row">
          <span class="bl-space-name">{{ s.name }}</span>
          <span class="bl-space-bar" [style.width.px]="s.px"></span>
          <span class="bl-space-value">{{ s.value }}</span>
        </div>
      }
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Section rhythm</div>
      <p class="preview-section__note">
        Vertical space between major sections is a fluid clamp, not a fixed
        value, so bands breathe more on wide screens and tighten on phones. It
        drives band padding and the <code>.divider</code> spacing, so vertical
        rhythm is never re-invented per page. One token, one rhythm: pages that
        need tighter spacing don't get a smaller token, they get fewer
        sections.
      </p>
      <table class="bl-token-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Value</th>
            <th>Drives</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>--mkt-section</code></td>
            <td><code>{{ section() }}</code></td>
            <td>Band padding, gap between major sections, .divider spacing</td>
          </tr>
        </tbody>
      </table>
      <div class="bl-rhythm" style="margin-top: var(--gt-space-4)">
        <div class="bl-rhythm-band">padding-block: --mkt-section</div>
        <hr class="bl-divider" />
        <div class="bl-rhythm-band">padding-block: --mkt-section</div>
      </div>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Side pattern</div>
      <p class="preview-section__note">
        Decorative brand-pattern bands down the left and right screen edges of
        sparse pages (support, blog). The
        <code>side-pattern($content-width)</code> mixin owns the column cap and
        the band math: each band's width tracks the free margin beside the
        centred column (capped at 330px), fades inward along an organic edge,
        and disappears below the small breakpoint. Pages pair it with
        <code>side-pattern-host</code> on the :host to clip horizontal
        overflow.
      </p>
      <div class="bl-sidepattern-demo">
        <div class="bl-sidepattern-band"></div>
        <div class="bl-sidepattern-col">content column</div>
        <div class="bl-sidepattern-band bl-sidepattern-band--right"></div>
      </div>
    </div>
  `,
})
export class BrandLayoutPreview {
  private readonly host = inject(ElementRef);
  private readonly themeStore = inject(ThemeStore);

  readonly containers = signal<ResolvedContainer[]>([]);
  readonly spaces = signal<ResolvedSpace[]>([]);
  readonly section = signal<string>("");

  private readonly containerDefs = [
    { name: "--mkt-container-wide", usage: "Heroes, full-width bands, page chrome" },
    { name: "--mkt-container-docs", usage: "The docs shell (sidebar + content)" },
    { name: "--mkt-container-home", usage: "Home body column + hero card (1320, grows to 1500 on large screens)" },
    { name: "--mkt-container-table", usage: "The pricing plan table" },
    { name: "--mkt-container-content", usage: "Standard content pages (support, etc.)" },
    { name: "--mkt-container-reading", usage: "Prose / blog reading column" },
    { name: "--mkt-container-narrow", usage: "Forms, centered copy" },
  ];

  private readonly spaceNames = [
    "--mkt-space-1",
    "--mkt-space-2",
    "--mkt-space-3",
    "--mkt-space-4",
    "--mkt-space-5",
    "--mkt-space-6",
    "--mkt-space-7",
    "--mkt-space-8",
    "--mkt-space-9",
  ];

  constructor() {
    effect(() => {
      this.themeStore.theme();
      const el = this.host.nativeElement as Element;

      const resolved = this.containerDefs.map((c) => ({
        ...c,
        value: resolveCssVar(c.name, el),
      }));
      const widest =
        Math.max(...resolved.map((c) => parseFloat(c.value) || 0)) || 1;
      this.containers.set(
        resolved.map((c) => ({
          name: c.name,
          usage: c.usage,
          value: c.value,
          pct: Math.round(((parseFloat(c.value) || 0) / widest) * 100),
        })),
      );

      this.spaces.set(
        this.spaceNames.map((name) => {
          const value = resolveCssVar(name, el);
          return { name, value, px: parseFloat(value) || 0 };
        }),
      );

      this.section.set(resolveCssVar("--mkt-section", el));
    });
  }
}
