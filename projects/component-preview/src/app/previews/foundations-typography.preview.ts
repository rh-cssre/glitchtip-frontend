import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CUSTOM_TYPE_CLASSES, resolveCssVar, TYPE_TOKENS } from "../foundations/tokens";
import { ThemeStore } from "../theme-store";

interface ResolvedType {
  name: string;
  label?: string;
  value: string;
}

/**
 * Interactive typography reference. Each Material 3 type token resolves to a
 * full `font` shorthand read live from the theme; applying it as
 * `font: var(--token)` reproduces the exact style, shown here as a sample.
 */
@Component({
  selector: "preview-foundations-typography",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .ft-row {
        padding-bottom: var(--gt-space-4);
        margin-bottom: var(--gt-space-4);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
      .ft-row:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      .ft-meta {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: var(--gt-space-1) var(--gt-space-3);
        margin-bottom: var(--gt-space-2);
      }
      .ft-token {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.78rem;
        color: var(--mat-sys-on-surface-variant);
      }
      .ft-label {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface);
      }
      .ft-sample {
        margin: 0;
      }
      .ft-value {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.72rem;
        color: var(--mat-sys-on-surface-variant);
        margin-top: var(--gt-space-2);
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Typography</h1>
      <p class="preview-lead">
        The type scale, read live from the theme. Apply a token as
        <code>font: var(--token)</code> to reproduce the exact style.
      </p>
    </header>

    <div class="preview-section">
      <div class="preview-section__title">Type tokens</div>
      @for (t of types(); track t.name) {
        <div class="ft-row">
          <div class="ft-meta">
            <span class="ft-token">{{ t.name }}</span>
            <span class="ft-label">{{ t.label }}</span>
          </div>
          <p class="ft-sample" [style.font]="'var(' + t.name + ')'">
            The quick brown fox jumps over the lazy dog
          </p>
          @if (t.value) {
            <div class="ft-value">{{ t.value }}</div>
          }
        </div>
      }
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Custom text classes</div>
      <p class="preview-section__note">
        Semantic classes the app layers on top of the raw type tokens (defined
        in <code>_font-files.scss</code>).
      </p>
      <section class="mat-typography">
        @for (c of customClasses; track c.className) {
          <div class="ft-row">
            <div class="ft-meta">
              <span class="ft-token">.{{ c.className }}</span>
              <span class="ft-label">{{ c.usage }}</span>
            </div>
            <p class="ft-sample" [class]="c.className">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        }
      </section>
    </div>
  `,
})
export class FoundationsTypographyPreview {
  private readonly host = inject(ElementRef);
  private readonly themeStore = inject(ThemeStore);

  readonly types = signal<ResolvedType[]>([]);
  readonly customClasses = CUSTOM_TYPE_CLASSES;

  constructor() {
    effect(() => {
      this.themeStore.theme();
      const el = this.host.nativeElement as Element;
      this.types.set(
        TYPE_TOKENS.map((t) => ({
          name: t.name,
          label: t.label,
          value: resolveCssVar(t.name, el),
        })),
      );
    });
  }
}
