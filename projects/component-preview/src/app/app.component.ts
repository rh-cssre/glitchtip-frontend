import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from "@angular/core";
import { NgComponentOutlet } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import {
  PREVIEWS,
  PreviewEntry,
  PreviewSection,
  groupedPreviews,
} from "./registry";
import { ThemeMode, ThemeStore } from "./theme-store";

@Component({
  selector: "preview-root",
  imports: [
    NgComponentOutlet,
    MatToolbarModule,
    MatListModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDividerModule,
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
  private readonly themeStore = inject(ThemeStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly selectedId = signal<string>(PREVIEWS[0]?.id ?? "");
  readonly section = signal<PreviewSection>("product");
  /** Mobile-only: whether the collapsed nav drawer is open. */
  readonly navOpen = signal(false);

  /**
   * Bare mode (?bare=1): renders only the selected preview with no shell.
   * Used by the example-width iframe so a component can be shown in a real
   * narrow viewport where media queries fire.
   */
  readonly bare = signal(false);

  /**
   * Accordion state for nav groups, keyed per section so a group name that
   * exists in both sections (Foundations, Components) collapses independently.
   * Groups start expanded.
   */
  private readonly collapsedGroups = signal<ReadonlySet<string>>(new Set());
  readonly theme = this.themeStore.theme;

  readonly groups = computed(() => groupedPreviews(this.section()));

  /** Nav filter: narrows the sidebar to entries whose label matches. */
  readonly navQuery = signal("");
  readonly filteredGroups = computed(() => {
    const q = this.navQuery().trim().toLowerCase();
    const groups = this.groups();
    if (!q) return groups;
    return groups
      .map((g) => ({
        group: g.group,
        entries: g.entries.filter((e) => e.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.entries.length > 0);
  });

  readonly selected = computed<PreviewEntry | undefined>(() =>
    PREVIEWS.find((p) => p.id === this.selectedId()),
  );

  // Applied to the whole layout so the toolbar, sidebar and canvas all theme
  // together (the app dogfoods its own design system rather than framing it in
  // fixed chrome).
  readonly themeClass = computed(() => `preview-theme--${this.theme()}`);

  constructor() {
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-filled");

    // Bare mode reports its content height to the embedding preview-doc so the
    // example iframe hugs the content instead of a fixed tall box.
    afterNextRender(() => {
      if (typeof ResizeObserver === "undefined") return;
      const post = () => {
        if (!this.bare()) return;
        window.parent?.postMessage(
          { __previewHeight: document.body.scrollHeight, p: this.selectedId() },
          location.origin,
        );
      };
      const observer = new ResizeObserver(() => post());
      observer.observe(document.body);
      this.destroyRef.onDestroy(() => observer.disconnect());
      post();
    });

    // Deep linking: the selected preview lives in the `p` query param so any
    // page can be shared as a URL (e.g. /style-guide/?p=table-pattern). The
    // subscription also serves back/forward navigation; select() below writes
    // the param, which round-trips through here.
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get("p");
        const entry = id && PREVIEWS.find((e) => e.id === id);
        if (entry && id !== this.selectedId()) {
          this.selectedId.set(entry.id);
          // A deep link into the other section also switches the nav to it.
          this.section.set(entry.section ?? "product");
        }
        this.bare.set(params.get("bare") === "1");
        // The embedding page passes its color scheme so the bare frame
        // matches the toggle outside.
        const theme = params.get("theme");
        if (theme === "light" || theme === "dark" || theme === "system") {
          this.theme.set(theme);
        }
      });
  }

  select(id: string): void {
    this.selectedId.set(id);
    this.navOpen.set(false);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { p: id },
      queryParamsHandling: "merge",
    });
  }

  setSection(section: PreviewSection): void {
    if (section === this.section()) return;
    this.section.set(section);
    // Land on the section's first page so the canvas matches the nav.
    const first = PREVIEWS.find((e) => (e.section ?? "product") === section);
    if (first) this.select(first.id);
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
  }

  toggleGroup(group: string): void {
    const key = `${this.section()}:${group}`;
    const next = new Set(this.collapsedGroups());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.collapsedGroups.set(next);
  }

  isGroupCollapsed(group: string): boolean {
    return this.collapsedGroups().has(`${this.section()}:${group}`);
  }
}
