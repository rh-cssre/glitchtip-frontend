import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from "@angular/router";
import { filter } from "rxjs";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { DOCS_NAV, findDoc } from "./docs-nav";

/**
 * Documentation shell: a persistent, grouped sidebar (from DOCS_NAV) beside the
 * routed content. The sidebar sticks on desktop and becomes a slide-in drawer on
 * small screens, so it works with the site's page-level scroll and sticky
 * toolbar instead of a nested mat-sidenav scroll container.
 */
@Component({
  selector: "mkt-documentation-layout",
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: "./documentation-layout.component.html",
  styleUrl: "./documentation-layout.component.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DocumentationLayoutComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  protected readonly nav = DOCS_NAV;
  protected readonly navOpen = signal(false);

  // The current page's breadcrumb (Docs / group / title), or null on the index.
  // Owned here so the mobile sub-bar can pair it with the menu trigger.
  protected readonly crumb = signal<{ group: string; title: string } | null>(
    null,
  );

  // Collapsible groups (expanded by default), like the design-system nav.
  protected readonly openGroups = signal(
    new Set(DOCS_NAV.map((group) => group.title)),
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateCrumb());
    this.updateCrumb();
  }

  private updateCrumb(): void {
    let leaf = this.route.firstChild;
    while (leaf?.firstChild) {
      leaf = leaf.firstChild;
    }
    const slug = leaf?.snapshot?.params?.["slug"];
    this.crumb.set(slug ? (findDoc(slug) ?? null) : null);
  }

  protected isGroupOpen(title: string): boolean {
    return this.openGroups().has(title);
  }

  protected toggleGroup(title: string): void {
    const next = new Set(this.openGroups());
    next.has(title) ? next.delete(title) : next.add(title);
    this.openGroups.set(next);
  }
}
