import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import {
  COLOR_TOKENS,
  ON_COLOR_PAIRS,
  resolveComputedColor,
  TokenGroup,
} from "../foundations/tokens";
import { ThemeStore } from "../theme-store";

interface ResolvedSwatch {
  name: string;
  label?: string;
  value: string;
}

interface ResolvedGroup {
  group: string;
  note?: string;
  swatches: ResolvedSwatch[];
}

interface ResolvedPair {
  label: string;
  bg: string;
  on: string;
}

/**
 * Interactive color-token reference. Every swatch's value is read live from
 * the DOM via `getComputedStyle`, so it reflects the real app theme and flips
 * with the canvas light/dark toggle rather than being hardcoded here.
 */
@Component({
  selector: "preview-foundations-colors",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .fc-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: var(--gt-space-4);
      }
      .fc-swatch {
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 12px;
        overflow: hidden;
      }
      .fc-swatch__chip {
        height: 76px;
      }
      .fc-swatch__meta {
        padding: var(--gt-space-2) var(--gt-space-3);
        background-color: var(--mat-sys-surface-container-low);
      }
      .fc-swatch__name {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.78rem;
        word-break: break-all;
      }
      .fc-swatch__value {
        font: var(--mat-sys-label-small);
        font-family: var(--gt-font-mono, monospace);
        color: var(--mat-sys-on-surface-variant);
        text-transform: uppercase;
      }
      .fc-pairs {
        display: flex;
        flex-wrap: wrap;
        gap: var(--gt-space-4);
      }
      .fc-pair {
        min-width: 180px;
        flex: 1;
        padding: var(--gt-space-4);
        border-radius: 12px;
        border: 1px solid var(--mat-sys-outline-variant);
      }
      .fc-pair__label {
        font: var(--mat-sys-title-small);
        margin-bottom: var(--gt-space-1);
      }
      .fc-pair__sample {
        font: var(--mat-sys-body-small);
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Color tokens</h1>
      <p class="preview-lead">
        Values are read live from the running theme, so this page cannot drift
        from the app. Toggle the color scheme in the toolbar to see tokens
        change.
      </p>
      <p class="preview-note">
        Note: the brand overrides for
        <code>--mat-sys-primary</code> / <code>--mat-sys-error</code> in dark
        mode are gated on your operating system's color-scheme setting, so those
        specific swatches follow the OS rather than this in-app toggle.
      </p>
    </header>

    @for (grp of groups(); track grp.group) {
      <div class="preview-section">
        <div class="preview-section__title">{{ grp.group }}</div>
        @if (grp.note) {
          <p class="preview-section__note">{{ grp.note }}</p>
        }
        <div class="fc-grid">
          @for (sw of grp.swatches; track sw.name) {
            <div class="fc-swatch">
              <div
                class="fc-swatch__chip"
                [style.background]="'var(' + sw.name + ')'"
              ></div>
              <div class="fc-swatch__meta">
                <div class="fc-swatch__name">{{ sw.name }}</div>
                <div class="fc-swatch__value">{{ sw.value }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    }

    <div class="preview-section">
      <div class="preview-section__title">Contrast pairings</div>
      <p class="preview-section__note">
        Each block renders its on-color as text over its background token.
      </p>
      <div class="fc-pairs">
        @for (pair of pairs; track pair.label) {
          <div
            class="fc-pair"
            [style.background]="'var(' + pair.bg + ')'"
            [style.color]="'var(' + pair.on + ')'"
          >
            <div class="fc-pair__label">{{ pair.label }}</div>
            <div class="fc-pair__sample">The quick brown fox jumps over</div>
          </div>
        }
      </div>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Dark mode</div>
      <p class="preview-section__note">
        The theme ships light and dark, both driven by the same tokens, so
        components adapt with no per-component work. Two things to keep in mind:
        Material 3 signals elevation in dark mode mainly through lighter surface
        tint (the higher <code>surface-container</code> tokens), not heavy
        shadows; and contrast that passes in light can fail in dark, so check
        new color pairings in both schemes.
      </p>
    </div>
  `,
})
export class FoundationsColorsPreview {
  private readonly host = inject(ElementRef);
  private readonly themeStore = inject(ThemeStore);

  readonly groups = signal<ResolvedGroup[]>([]);
  readonly pairs: ResolvedPair[] = ON_COLOR_PAIRS.map((p) => ({
    label: p.label,
    bg: p.bg,
    on: p.on,
  }));

  constructor() {
    // Re-resolve whenever the color scheme changes. The effect flushes after
    // the canvas' `color-scheme` class has been applied, so getComputedStyle
    // observes the current scheme.
    effect(() => {
      this.themeStore.theme();
      this.resolve();
    });
  }

  private resolve(): void {
    const el = this.host.nativeElement as Element;
    this.groups.set(
      COLOR_TOKENS.map((grp: TokenGroup) => ({
        group: grp.group,
        note: grp.note,
        swatches: grp.tokens.map((t) => ({
          name: t.name,
          label: t.label,
          value: resolveComputedColor(t.name, el),
        })),
      })),
    );
  }
}
