import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { fromEvent, map } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { PreviewStatus } from "../registry";
import { ThemeStore } from "../theme-store";
import { DocBulletsComponent } from "./doc-bullets.component";

/** One row of a component's input/output API table. */
export interface ApiRow {
  /** Input/output name, e.g. `buttonStyle` or `(buttonClick)`. */
  name: string;
  /** Type or accepted values, e.g. `"flat" | "stroked"`. */
  type: string;
  /** Default value; leave unset (blank) when there isn't one. */
  default?: string;
  /** Short description of what it does. */
  description: string;
}

/** One row of a keyboard-interaction table. */
export interface KeyRow {
  /** Key or key combo, e.g. `Enter`, `Space`, `Tab`. */
  keys: string;
  /** What pressing it does. */
  description: string;
}

/**
 * Reusable documentation wrapper for a component preview. Renders a heading,
 * description, when-to-use / do / don't guidance, an accessibility note, the
 * live example (projected via <ng-content>), and a copyable code snippet.
 *
 * Adoption is incremental: a preview keeps working unwrapped, and wrapping it
 * is purely additive. Guidance is passed as signal inputs so a preview stays a
 * thin, declarative description of the real component.
 */
@Component({
  selector: "preview-doc",
  imports: [ClipboardModule, MatIconModule, MatButtonModule, DocBulletsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: var(--gt-space-7);
      }
      .doc-title-row {
        display: flex;
        align-items: center;
        gap: var(--gt-space-3);
        margin-bottom: var(--gt-space-2);
      }
      .doc-title {
        font: var(--mat-sys-headline-small);
        margin: 0;
      }
      // Lifecycle status chip (stable / legacy / deprecated), colored with the
      // extended semantic roles so it reads correctly in both schemes.
      .doc-status {
        font: var(--mat-sys-label-small);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        padding: 2px 8px;
        border-radius: 4px;
      }
      .doc-status--stable {
        background-color: var(--success-container);
        color: var(--on-success);
      }
      .doc-status--legacy {
        background-color: var(--warning-container);
        color: var(--on-warning);
      }
      .doc-status--deprecated {
        background-color: var(--mat-sys-error);
        color: var(--mat-sys-on-error);
      }
      // Visual-audit note: neutral so it reads as an annotation, not a state.
      .doc-status--note {
        background-color: var(--mat-sys-surface-container-high);
        color: var(--mat-sys-on-surface-variant);
        border: 1px solid var(--mat-sys-outline-variant);
        text-transform: none;
        letter-spacing: normal;
      }
      .doc-description {
        font: var(--mat-sys-body-large);
        color: var(--mat-sys-on-surface-variant);
        margin: 0 0 var(--gt-space-5);
        max-width: 74ch;
      }
      .doc-example {
        padding: var(--gt-space-5);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        background-color: var(--mat-sys-surface-container-low);
        margin-bottom: var(--gt-space-5);
      }
      // Page-level chrome (app bars, page skeletons) renders edge-to-edge so
      // its own borders meet the frame, the way it meets the viewport in the
      // real app. Without this, full-bleed components float oddly in padding.
      .doc-example--flush {
        padding: 0;
        overflow: hidden;
        background-color: var(--mat-sys-surface);
      }
      // Sits directly above the example card (left-aligned) so it reads as
      // the control for that card, not a page-level control floating right.
      .doc-example-tools {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: var(--gt-space-1);
        margin-bottom: var(--gt-space-2);
      }
      .doc-example-tools__label {
        font: var(--mat-sys-label-small);
        color: var(--mat-sys-on-surface-variant);
        margin-right: var(--gt-space-2);
      }
      .doc-example-tools__btn {
        appearance: none;
        background: none;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 4px;
        padding: 2px var(--gt-space-2);
        font: var(--mat-sys-label-small);
        color: var(--mat-sys-on-surface-variant);
        cursor: pointer;

        &:hover {
          background-color: var(--mat-sys-surface-container-high);
        }

        &--active {
          background-color: var(--mat-sys-secondary-container);
          color: var(--mat-sys-on-secondary-container);
          border-color: transparent;
        }
      }
      // Real nested viewport for mobile/tablet: media queries fire inside.
      // Styled to match .doc-example so switching widths changes only the
      // width, not the framing or background.
      .doc-example-frame {
        display: block;
        max-width: 100%;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        background-color: var(--mat-sys-surface-container-low);
        margin-bottom: var(--gt-space-5);
      }
      .doc-example-frame--flush {
        background-color: var(--mat-sys-surface);
      }
      // Inside the iframe only the example renders; drop the card chrome (the
      // iframe itself is the card) but match the inline padding.
      .doc-example--bare {
        border: none;
        border-radius: 0;
        background: none;
        margin: 0;
        padding: var(--gt-space-5);

        &.doc-example--flush {
          padding: 0;
        }
      }
      .doc-when {
        margin-bottom: var(--gt-space-5);
      }
      // Do and Don't are always a matched two-column pair so they read as a
      // set, not three blocks flowing into an auto-fit grid. They stack on
      // narrow screens. A colored top rule gives each side a consistent
      // signature (green for Do, red for Don't).
      .doc-dodont {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--gt-space-5);
        margin-bottom: var(--gt-space-5);
      }
      @media (max-width: 560px) {
        .doc-dodont {
          grid-template-columns: 1fr;
          gap: var(--gt-space-4);
        }
      }
      .doc-block__label {
        font: var(--mat-sys-label-large);
        margin: 0 0 var(--gt-space-2);
      }
      .doc-a11y {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-1);
        padding: var(--gt-space-4);
        border-radius: 8px;
        background-color: var(--info-container);
        color: var(--on-info);
        font: var(--mat-sys-body-medium);
        margin-bottom: var(--gt-space-5);
        max-width: 74ch;
      }
      .doc-a11y__label {
        font: var(--mat-sys-label-large);
        font-weight: 700;
      }
      .doc-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: var(--gt-space-5);
        font: var(--mat-sys-body-small);
      }
      .doc-table th,
      .doc-table td {
        text-align: left;
        padding: var(--gt-space-2) var(--gt-space-3);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
        vertical-align: top;
      }
      .doc-table th {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
      }
      .doc-table code {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.82em;
      }
      kbd {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.8em;
        padding: 1px 6px;
        border-radius: 4px;
        border: 1px solid var(--mat-sys-outline-variant);
        background-color: var(--mat-sys-surface-container-high);
      }
      .doc-rel {
        display: flex;
        gap: var(--gt-space-3);
        font: var(--mat-sys-body-medium);
        margin: 0 0 var(--gt-space-1);
      }
      .doc-rel__key {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
        min-width: 9ch;
      }
      .doc-anatomy {
        margin: 0 0 var(--gt-space-5);
        padding: var(--gt-space-3) var(--gt-space-4);
        border-radius: 8px;
        background-color: var(--mat-sys-surface-container-high);
        overflow-x: auto;
      }
      .doc-anatomy code {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.82rem;
        white-space: pre;
      }
      .doc-code {
        position: relative;
      }
      .doc-code__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
        margin-bottom: var(--gt-space-1);
      }
      .doc-code pre {
        margin: 0;
        padding: var(--gt-space-3) var(--gt-space-4);
        border-radius: 8px;
        background-color: var(--mat-sys-surface-container-high);
        overflow-x: auto;
      }
      .doc-code code {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.82rem;
        white-space: pre;
      }
    `,
  ],
  template: `
    @if (!bare()) {
      <div class="doc-title-row">
        <h2 class="doc-title">{{ title() }}</h2>
        @if (status(); as s) {
          <span class="doc-status doc-status--{{ s }}">{{ s }}</span>
        }
        @for (note of designNotes(); track note) {
          <span class="doc-status doc-status--note">{{ note }}</span>
        }
      </div>
      @if (description()) {
        <p class="doc-description">{{ description() }}</p>
      }

      @if (widthToggle()) {
        <div class="doc-example-tools">
          <span class="doc-example-tools__label">Example width</span>
          @for (v of viewports; track v.key) {
            <button
              class="doc-example-tools__btn"
              [class.doc-example-tools__btn--active]="viewport() === v.key"
              (click)="viewport.set(v.key)"
            >
              {{ v.label }}
            </button>
          }
        </div>
      }
    }
    <div
      class="doc-example"
      [class.doc-example--flush]="flushExample()"
      [class.doc-example--bare]="bare()"
      [hidden]="frameActive()"
    >
      <ng-content />
    </div>
    @if (frameActive()) {
      <iframe
        class="doc-example-frame"
        [class.doc-example-frame--flush]="flushExample()"
        [style.width.px]="viewportWidth()"
        [style.height.px]="frameHeight()"
        [src]="frameSrc()"
        title="Example in a {{ viewportWidth() }}px viewport"
      ></iframe>
    }

    @if (!bare()) {
    @if (whenToUse().length) {
      <doc-bullets class="doc-when" label="When to use" [items]="whenToUse()" />
    }
    @if (dos().length || donts().length) {
      <div class="doc-dodont">
        @if (dos().length) {
          <doc-bullets label="Do" [items]="dos()" tone="do" />
        }
        @if (donts().length) {
          <doc-bullets label="Don't" [items]="donts()" tone="dont" />
        }
      </div>
    }

    @if (content().length) {
      <doc-bullets class="doc-when" label="Writing" [items]="content()" />
    }

    @if (a11y()) {
      <div class="doc-a11y">
        <span class="doc-a11y__label">Accessibility</span>
        <span>{{ a11y() }}</span>
      </div>
    }

    @if (keyboard().length) {
      <div class="doc-block">
        <p class="doc-block__label">Keyboard</p>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            @for (row of keyboard(); track row.keys) {
              <tr>
                <td><kbd>{{ row.keys }}</kbd></td>
                <td>{{ row.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    @if (anatomy()) {
      <div class="doc-block">
        <p class="doc-block__label">Anatomy</p>
        <pre class="doc-anatomy"><code>{{ anatomy() }}</code></pre>
      </div>
    }

    @if (composition().within?.length || composition().contains?.length) {
      <div class="doc-block">
        <p class="doc-block__label">Relationships</p>
        @if (composition().within?.length) {
          <p class="doc-rel">
            <span class="doc-rel__key">Fits within</span>
            <span>{{ composition().within!.join(", ") }}</span>
          </p>
        }
        @if (composition().contains?.length) {
          <p class="doc-rel">
            <span class="doc-rel__key">Contains</span>
            <span>{{ composition().contains!.join(", ") }}</span>
          </p>
        }
      </div>
    }

    @if (api().length) {
      <div class="doc-block">
        <p class="doc-block__label">Properties</p>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            @for (row of api(); track row.name) {
              <tr>
                <td><code>{{ row.name }}</code></td>
                <td><code>{{ row.type }}</code></td>
                <td><code>{{ row.default }}</code></td>
                <td>{{ row.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    @if (importCode()) {
      <div class="doc-code">
        <div class="doc-code__header">
          <span>Import</span>
          <button
            mat-icon-button
            class="small-icon-button"
            [cdkCopyToClipboard]="importCode()"
            [attr.aria-label]="'Copy import statement'"
          >
            <mat-icon>file_copy</mat-icon>
          </button>
        </div>
        <pre><code>{{ importCode() }}</code></pre>
      </div>
    }

    @if (code()) {
      <div class="doc-code">
        <div class="doc-code__header">
          <span>Usage</span>
          <button
            mat-icon-button
            class="small-icon-button"
            [cdkCopyToClipboard]="code()"
            (cdkCopyToClipboardCopied)="onCopied()"
            [attr.aria-label]="'Copy usage snippet'"
          >
            <mat-icon>{{ copied() ? "done" : "file_copy" }}</mat-icon>
          </button>
        </div>
        <pre><code>{{ code() }}</code></pre>
      </div>
    }
    }
  `,
})
export class PreviewDocComponent {
  readonly title = input.required<string>();
  readonly status = input<PreviewStatus | undefined>(undefined);
  /**
   * Visual-audit flags, orthogonal to the lifecycle status: `status` tracks
   * code conventions, these track design polish (e.g. "visual refresh
   * planned", "off-system by design"). Each note is expected to map to a
   * ticket when the audit lands.
   */
  readonly designNotes = input<string[]>([]);
  /** Renders the example edge-to-edge; use for page-level chrome. */
  readonly flushExample = input(false);
  /**
   * Shows the example-width toggle. Opt in only where width changes the
   * layout (page chrome, tables); on narrow components the toggle is noise.
   */
  readonly widthToggle = input(false);
  readonly description = input<string>("");
  readonly whenToUse = input<string[]>([]);
  readonly dos = input<string[]>([]);
  readonly donts = input<string[]>([]);
  readonly a11y = input<string>("");
  /** Writing / content guidelines: how to word this component's labels. */
  readonly content = input<string[]>([]);
  readonly keyboard = input<KeyRow[]>([]);
  readonly anatomy = input<string>("");
  /**
   * Composition guidance: which components this one is meant to sit inside
   * (`within`) and which it is meant to hold (`contains`). Names should match
   * other pages' titles so a reader can find them.
   */
  readonly composition = input<{ within?: string[]; contains?: string[] }>({});
  readonly api = input<ApiRow[]>([]);
  /** Copyable import statement, shown above Usage so snippets are paste-ready. */
  readonly importCode = input<string>("");
  readonly code = input<string>("");

  readonly copied = signal(false);

  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly themeStore = inject(ThemeStore);

  /**
   * Example-width presets. Mobile and tablet render the example inside a
   * same-origin iframe (?p=<id>&bare=1), a real nested viewport where the
   * app's media queries and BreakpointObserver signals genuinely fire.
   */
  readonly viewports = [
    { key: "mobile", label: "Mobile", width: 360 },
    { key: "tablet", label: "Tablet", width: 768 },
    { key: "full", label: "Full", width: null },
  ] as const;
  readonly viewport = signal<"mobile" | "tablet" | "full">("full");
  readonly viewportWidth = computed(
    () => this.viewports.find((v) => v.key === this.viewport())?.width ?? null,
  );

  /** Bare mode: this page is itself inside the example iframe. */
  readonly bare = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get("bare") === "1")),
    { initialValue: false },
  );
  private readonly pageId = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get("p") ?? "")),
    { initialValue: "" },
  );
  readonly frameActive = computed(
    () => !this.bare() && this.viewportWidth() !== null && !!this.pageId(),
  );
  readonly frameSrc = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `?p=${this.pageId()}&bare=1&theme=${this.themeStore.theme()}`,
    ),
  );

  /**
   * The iframe height is driven by the bare page inside it, which posts its
   * content height. This keeps the mobile/tablet frame as compact as the
   * inline full view instead of a fixed tall box with empty space.
   */
  readonly frameHeight = signal(160);

  constructor() {
    fromEvent<MessageEvent>(window, "message")
      .pipe(takeUntilDestroyed())
      .subscribe((e) => {
        if (e.origin !== location.origin) return;
        const d = e.data as { __previewHeight?: number; p?: string };
        if (
          d &&
          typeof d.__previewHeight === "number" &&
          d.p === this.pageId()
        ) {
          this.frameHeight.set(Math.max(80, Math.ceil(d.__previewHeight)));
        }
      });
  }

  onCopied(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
