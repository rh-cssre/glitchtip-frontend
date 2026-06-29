import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from "@angular/core";
import { NgComponentOutlet } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { PREVIEWS, PreviewEntry, groupedPreviews } from "./registry";

type ThemeMode = "system" | "light" | "dark";

@Component({
  selector: "preview-root",
  imports: [
    NgComponentOutlet,
    MatToolbarModule,
    MatListModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./app.component.html",
})
export class AppComponent {
  // The app self-hosts the "Material Symbols Outlined" font and points mat-icon
  // at it via this font-set class (same as the main app's root component);
  // without it mat-icon falls back to the unloaded "Material Icons" font and
  // renders the ligature names as literal text.
  private readonly matIconRegistry = inject(MatIconRegistry);

  readonly groups = groupedPreviews();
  readonly selectedId = signal<string>(PREVIEWS[0]?.id ?? "");
  readonly theme = signal<ThemeMode>("system");

  readonly selected = computed<PreviewEntry | undefined>(() =>
    PREVIEWS.find((p) => p.id === this.selectedId()),
  );

  readonly canvasThemeClass = computed(
    () => `preview-canvas--${this.theme()}`,
  );

  constructor() {
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-filled");
  }

  select(id: string): void {
    this.selectedId.set(id);
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
  }
}
