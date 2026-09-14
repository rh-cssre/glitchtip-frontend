import { Injectable, signal } from "@angular/core";

export type ThemeMode = "system" | "light" | "dark";

/**
 * Shared, app-wide current color scheme. The toolbar toggle writes it and the
 * canvas applies it via `color-scheme`; Foundations pages read it so they can
 * re-resolve their live token values whenever the scheme changes (the visual
 * swatches update automatically via CSS `var()`, but the printed values need
 * to be recomputed).
 */
@Injectable({ providedIn: "root" })
export class ThemeStore {
  readonly theme = signal<ThemeMode>("system");
}
