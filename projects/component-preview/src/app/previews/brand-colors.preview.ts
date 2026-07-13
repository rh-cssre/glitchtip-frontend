import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { resolveComputedColor } from "../foundations/tokens";
import { ThemeStore } from "../theme-store";

const BRAND_COLOR_TOKENS: { name: string; usage: string }[] = [
  { name: "--mat-sys-primary", usage: "Brand red; CTAs and the fancy accent" },
  { name: "--mkt-accent-blue", usage: "Marketing accent (illustrations, highlights)" },
  { name: "--mkt-accent-yellow", usage: "Marketing accent (illustrations, highlights)" },
];

interface ResolvedSwatch {
  name: string;
  usage: string;
  value: string;
}

/**
 * The marketing palette: the shared brand primary plus the two
 * marketing-only accent tokens. Values resolve live, like the product pages.
 */
@Component({
  selector: "preview-brand-colors",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bc-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: var(--gt-space-4);
      }
      .bc-swatch {
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 12px;
        overflow: hidden;
      }
      .bc-swatch__chip {
        height: 76px;
      }
      .bc-swatch__meta {
        padding: var(--gt-space-2) var(--gt-space-3);
        background-color: var(--mat-sys-surface-container-low);
      }
      .bc-swatch__name {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.78rem;
        word-break: break-all;
      }
      .bc-swatch__value {
        font: var(--mat-sys-label-small);
        font-family: var(--gt-font-mono, monospace);
        color: var(--mat-sys-on-surface-variant);
        text-transform: uppercase;
      }
      .bc-swatch__usage {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        margin-top: var(--gt-space-1);
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Brand colors</h1>
      <p class="preview-lead">
        Marketing shares the product's Material theme and adds two accent
        tokens. The brand primary is the same token in both worlds, so a theme
        change propagates everywhere.
      </p>
    </header>

    <div class="preview-section">
      <div class="preview-section__title">Palette</div>
      <div class="bc-grid">
        @for (sw of swatches(); track sw.name) {
          <div class="bc-swatch">
            <div
              class="bc-swatch__chip"
              [style.background]="'var(' + sw.name + ')'"
            ></div>
            <div class="bc-swatch__meta">
              <div class="bc-swatch__name">{{ sw.name }}</div>
              <div class="bc-swatch__value">{{ sw.value }}</div>
              <div class="bc-swatch__usage">{{ sw.usage }}</div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class BrandColorsPreview {
  private readonly host = inject(ElementRef);
  private readonly themeStore = inject(ThemeStore);

  readonly swatches = signal<ResolvedSwatch[]>([]);

  constructor() {
    effect(() => {
      this.themeStore.theme();
      const el = this.host.nativeElement as Element;
      this.swatches.set(
        BRAND_COLOR_TOKENS.map((t) => ({
          name: t.name,
          usage: t.usage,
          value: resolveComputedColor(t.name, el),
        })),
      );
    });
  }
}
