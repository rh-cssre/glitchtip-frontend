import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

/**
 * The app uses a **subset** of Material Symbols Outlined, self-hosted as a
 * single woff2 to keep network transfer small (see `_font-files.scss`). When
 * that subset is regenerated, a symbol the app relies on can silently drop out
 * and render as its literal ligature text instead of a glyph.
 *
 * This page renders every symbol referenced by `<mat-icon>` in the **main
 * app** (`src/app`), so the subset can be eyeballed after any font/icon
 * change: a real glyph means it's in the subset; seeing the name render as a
 * plain letter/word means the glyph is missing and needs adding to the subset.
 *
 * Scope note: the `marketing` project loads Material Symbols through its own
 * pipeline, so its icons (arrow_forward, forum, public, rss_feed, …) are
 * intentionally NOT here — they aren't in this self-hosted subset.
 *
 * The list is kept in sync by hand — when you add a new `<mat-icon>name</...>`
 * to the app, add the name here too (and regenerate the subset to include it).
 */
@Component({
  selector: "preview-symbols",
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .sym-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 8px;
      }
      .sym-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 16px 8px;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        text-align: center;
        background-color: var(--mat-sys-surface-container-low);
      }
      .sym-cell mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .sym-cell__name {
        font: var(--mat-sys-label-small);
        word-break: break-word;
        opacity: 0.8;
      }
    `,
  ],
  template: `
    <p class="preview-section__title">
      {{ symbols.length }} Material Symbols in the self-hosted subset
    </p>
    <div class="sym-grid">
      @for (name of symbols; track name) {
        <div class="sym-cell">
          <mat-icon>{{ name }}</mat-icon>
          <span class="sym-cell__name">{{ name }}</span>
        </div>
      }
    </div>
  `,
})
export class SymbolsPreview {
  // Mirrors every `<mat-icon>name</mat-icon>` used in the main app (src/app).
  readonly symbols: string[] = [
    "account_circle",
    "account_tree",
    "add",
    "add_circle_outline",
    "arrow_drop_down",
    "avg_pace",
    "breaking_news",
    "brightness_medium",
    "cached",
    "check_box",
    "check_circle",
    "clear",
    "close",
    "cloud",
    "code",
    "dark_mode",
    "delete",
    "done",
    "edit",
    "email",
    "expand_more",
    "favorite",
    "file_copy",
    "filter_list",
    "help",
    "keyboard_arrow_down",
    "keyboard_arrow_left",
    "keyboard_arrow_right",
    "keyboard_arrow_up",
    "left_panel_close",
    "left_panel_open",
    "light_mode",
    "logout",
    "menu",
    "more_horiz",
    "more_vert",
    "open_in_new",
    "person",
    "rocket_launch",
    "search",
    "send",
    "settings",
    "share_eta",
    "text_snippet",
    "warning",
  ];
}
