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
      .ft-measure {
        margin: 0;
        padding: var(--gt-space-2) 0;
        border-right: 2px dashed var(--mat-sys-outline-variant);
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
      }
      .ft-measure--wide {
        max-width: var(--gt-measure);
      }
      .ft-measure--narrow {
        max-width: var(--gt-measure-narrow);
        margin: 0 auto;
        text-align: center;
        border-left: 2px dashed var(--mat-sys-outline-variant);
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

    <div class="preview-section">
      <div class="preview-section__title">Running text</div>
      <p class="preview-section__note">
        Sentences (page intros, section help, empty-state messages) are capped
        at a reading width and use the in-sentence link style. Widths are in
        characters so they follow the user's font size.
      </p>

      <div class="ft-row">
        <div class="ft-meta">
          <span class="ft-token">.page-intro</span>
          <span class="ft-label"
            >One muted line of orientation under a page title</span
          >
        </div>
        <p class="page-intro">
          Members of a team get email alerts for the team's projects. Access to
          projects comes from <a href="#">organization membership</a>.
        </p>
      </div>

      <div class="ft-row">
        <div class="ft-meta">
          <span class="ft-token">--gt-measure</span>
          <span class="ft-label">70ch: left-aligned text</span>
        </div>
        <p class="ft-measure ft-measure--wide">
          Lines stop at about seventy characters, the edge marked here, so the
          eye can find the start of the next line. Section help and page intros
          use this width.
        </p>
      </div>

      <div class="ft-row">
        <div class="ft-meta">
          <span class="ft-token">--gt-measure-narrow</span>
          <span class="ft-label">44ch: short centered text</span>
        </div>
        <p class="ft-measure ft-measure--narrow">
          Centered text reads worse over long lines, so empty-state messages use
          the narrow width.
        </p>
      </div>

      <div class="ft-row">
        <div class="ft-meta">
          <span class="ft-token">.gt-prose a</span>
          <span class="ft-label">A link inside a sentence</span>
        </div>
        <p class="ft-sample gt-prose">
          Links in running text are <a href="#">underlined in the text color</a>
          at normal weight. Standalone links, like a list row's name, keep the
          bold style.
        </p>
      </div>

      <ul class="preview-section__note">
        <li
          >Do: add <code>gt-prose</code> to any element that holds sentences
          with links.</li
        >
        <li
          >Do: cap running text with <code>--gt-measure</code>; use the narrow
          width only for centered text.</li
        >
        <li
          >Don't: color links with the primary color; in GlitchTip's theme it
          reads as a warning.</li
        >
        <li
          >Don't: cap form fields with these tokens; field width is a layout
          choice, not a reading width.</li
        >
      </ul>
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
