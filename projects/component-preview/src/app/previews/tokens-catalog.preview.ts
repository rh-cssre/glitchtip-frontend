import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import {
  COLOR_TOKENS,
  TYPE_TOKENS,
  SPACE_TOKENS,
  ELEVATION_TOKENS,
  resolveCssVar,
  resolveComputedColor,
} from "../foundations/tokens";
import { ThemeStore } from "../theme-store";

interface TokenRow {
  name: string;
  group: string;
  isColor: boolean;
  value: string;
}

/**
 * A single searchable catalog of every token, complementing the visual
 * Colors/Typography/Layout pages. Names are authored (see tokens.ts); values
 * resolve live from the theme, so the catalog cannot drift.
 */
@Component({
  selector: "preview-tokens-catalog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .tc-search {
        width: 100%;
        max-width: 320px;
        padding: var(--gt-space-2) var(--gt-space-3);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        background-color: var(--mat-sys-surface);
        color: var(--mat-sys-on-surface);
        font: var(--mat-sys-body-medium);
        margin-bottom: var(--gt-space-4);
      }
      .tc-table {
        width: 100%;
        border-collapse: collapse;
        font: var(--mat-sys-body-small);
      }
      .tc-table th,
      .tc-table td {
        text-align: left;
        padding: var(--gt-space-2) var(--gt-space-3);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
        vertical-align: middle;
      }
      .tc-table th {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
      }
      .tc-name {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.82em;
        white-space: nowrap;
      }
      .tc-value {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.78em;
        color: var(--mat-sys-on-surface-variant);
        max-width: 40ch;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tc-swatch {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid var(--mat-sys-outline-variant);
        vertical-align: middle;
      }
      .tc-group {
        font: var(--mat-sys-label-small);
        color: var(--mat-sys-on-surface-variant);
      }
      .tc-empty {
        color: var(--mat-sys-on-surface-variant);
        font: var(--mat-sys-body-medium);
        padding: var(--gt-space-4) 0;
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Design tokens</h1>
      <p class="preview-lead">
        Every token in one place, with its live value. Use the visual Colors,
        Typography, and Layout pages to learn the system; use this to look a
        token up. Filter by name.
      </p>
    </header>

    <input
      class="tc-search"
      type="search"
      placeholder="Filter tokens, e.g. surface, space, error"
      [value]="query()"
      (input)="query.set($any($event.target).value)"
    />

    @if (filtered().length) {
      <table class="tc-table">
        <thead>
          <tr>
            <th></th>
            <th>Token</th>
            <th>Value</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          @for (row of filtered(); track row.name) {
            <tr>
              <td>
                @if (row.isColor) {
                  <span class="tc-swatch" [style.background-color]="'var(' + row.name + ')'"></span>
                }
              </td>
              <td class="tc-name">{{ row.name }}</td>
              <td class="tc-value" [title]="row.value">{{ row.value }}</td>
              <td class="tc-group">{{ row.group }}</td>
            </tr>
          }
        </tbody>
      </table>
    } @else {
      <p class="tc-empty">No tokens match "{{ query() }}".</p>
    }
  `,
})
export class TokensCatalogPreview {
  private readonly host = inject(ElementRef);
  private readonly themeStore = inject(ThemeStore);

  readonly query = signal("");

  // Authored token set, flattened from the Foundations lists.
  private readonly defs: { name: string; group: string; isColor: boolean }[] = [
    ...COLOR_TOKENS.flatMap((g) =>
      g.tokens.map((t) => ({ name: t.name, group: g.group, isColor: true })),
    ),
    ...TYPE_TOKENS.map((t) => ({ name: t.name, group: "Typography", isColor: false })),
    ...SPACE_TOKENS.map((t) => ({ name: t.name, group: "Spacing", isColor: false })),
    ...ELEVATION_TOKENS.map((t) => ({ name: t.name, group: "Elevation", isColor: false })),
  ];

  private readonly resolved = signal<TokenRow[]>([]);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const rows = this.resolved();
    if (!q) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(q) || r.group.toLowerCase().includes(q),
    );
  });

  constructor() {
    effect(() => {
      this.themeStore.theme();
      const el = this.host.nativeElement as Element;
      this.resolved.set(
        this.defs.map((d) => ({
          name: d.name,
          group: d.group,
          isColor: d.isColor,
          value: d.isColor
            ? resolveComputedColor(d.name, el)
            : resolveCssVar(d.name, el) || "(unset)",
        })),
      );
    });
  }
}
