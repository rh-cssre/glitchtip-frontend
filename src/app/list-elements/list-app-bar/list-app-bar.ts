import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { RouterLink } from "@angular/router";
import { MatButton, MatIconButton } from "@angular/material/button";
import { ProjectMultiselect } from "../project-multiselect/project-multiselect";
import { ListTitleComponent } from "../list-title/list-title.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { MatIcon } from "@angular/material/icon";
import { TimeRangeSelect } from "../timerange-select/time-range-select";
import { NgTemplateOutlet } from "@angular/common";
import { MatBadge } from "@angular/material/badge";

@Component({
  standalone: true,
  selector: "gt-list-app-bar",
  imports: [
    MatBadge,
    MatButton,
    MatIconButton,
    MatIcon,
    NgTemplateOutlet,
    ListTitleComponent,
    ProjectMultiselect,
    RouterLink,
    TimeRangeSelect,
  ],
  templateUrl: "./list-app-bar.html",
  styleUrl: "./list-app-bar.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAppBar {
  private organizationsService = inject(OrganizationsService);
  protected breakPointObserver = inject(BreakpointObserver);

  listTitle = input("");
  searchHits = input<string>();
  // Project-multiselect will not be shown if not provided
  queriedProjects = input<string[]>();
  includeTimeRangeSelect = input(false);
  queriedTimeRangeStart = input<string | undefined>();
  queriedTimeRangeEnd = input<string | undefined>();
  // Determines whether or not to show "add project" button
  // instead of project-multiselect, for when org has no projects
  displayAddProject = input(false);
  filtersApplied = computed(() => {
    let count = 0;
    if (this.queriedProjects()?.length) {
      count += 1;
    }
    if (this.queriedTimeRangeStart() || this.queriedTimeRangeEnd()) {
      count += 1;
    }
    return count;
  });

  activeOrgLoaded = this.organizationsService.activeOrganizationLoaded;
  activeOrgHasNoProjects = computed(
    () => this.organizationsService.activeOrganizationProjects().length === 0,
  );
  activeOrgSlug = this.organizationsService.activeOrganizationSlug;
  accessProjectWrite = this.organizationsService.accessProjectWrite;

  smallBreakpointSignal = toSignal(
    this.breakPointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]),
  );
  isLargeScreen = signal(true);
  showExpandedFilters = signal(false);

  constructor() {
    effect(() => {
      const breakpointResult = this.smallBreakpointSignal();
      if (breakpointResult?.matches) {
        this.isLargeScreen.set(false);
      } else {
        this.isLargeScreen.set(true);
      }
      this.showExpandedFilters.set(false);
    });
  }

  toggleExpandedFilters() {
    this.showExpandedFilters.set(!this.showExpandedFilters());
  }
}
