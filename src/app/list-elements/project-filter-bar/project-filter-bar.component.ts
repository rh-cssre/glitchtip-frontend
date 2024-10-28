import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
  HostListener,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { filter, map, startWith, tap } from "rxjs/operators";
import { Observable, combineLatest, BehaviorSubject } from "rxjs";
import { FormControl } from "@angular/forms";
import { OrganizationProject } from "src/app/api/projects/projects-api.interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatExpansionPanel } from "@angular/material/expansion";
import { normalizeProjectParams } from "src/app/shared/shared.utils";

@Component({
  standalone: true,
  selector: "gt-project-filter-bar",
  imports: [
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatExpansionModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
  ],
  templateUrl: "./project-filter-bar.component.html",
  styleUrls: ["./project-filter-bar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFilterBarComponent implements OnInit {
  orgSlug$ = this.organizationsService.activeOrganizationSlug$;
  /** All projects available */
  projects$ = this.organizationsService.activeOrganizationProjects$;

  /** Projects that are selected in this component but not yet applied */
  selectedProjectIds = new BehaviorSubject<number[]>([]);

  /** Observable of selectedProjectIds, intended to separate concerns */
  selectedProjectIds$ = this.selectedProjectIds.asObservable();

  /** Projects that were previously selected and applied */
  appliedProjectIds$ = this.route.queryParams.pipe(
    map((params) => {
      const normalizedParams = normalizeProjectParams(params.project);
      this.selectedProjectIds.next(normalizedParams);
      return normalizedParams;
    }),
  );

  appliedProjectIds?: number[];

  /** Use selected projects to generate a string that's displayed in the UI */
  selectedProjectsString$ = combineLatest([
    this.projects$,
    this.selectedProjectIds$,
  ]).pipe(
    map(([projects, ids]) => {
      if (projects?.length === 1) {
        return projects[0].name;
      }
      switch (ids.length) {
        case 0:
          return "My Projects";
        case projects?.length:
          return "All Projects";
        default:
          return ids
            .map((id) => projects?.find((project) => id === project.id)?.name)
            .join(", ");
      }
    }),
  );

  selectedAndAppliedIdsAreEqual$ = combineLatest([
    this.selectedProjectIds$,
    this.appliedProjectIds$,
  ]).pipe(
    map(
      ([selected, applied]) =>
        selected.sort().join(",") === applied.sort().join(","),
    ),
  );

  /** Used to filter project names */
  filterProjectInput = new FormControl();

  /** Projects that are filtered via the text field form control */
  filteredProjects$: Observable<OrganizationProject[] | null> = combineLatest([
    this.projects$.pipe(startWith([] as OrganizationProject[])),
    this.filterProjectInput.valueChanges.pipe(startWith("")),
  ]).pipe(
    map(([projects, value]) =>
      projects
        ? projects.filter((project) =>
            project.name.toLowerCase().includes(value.toLowerCase()),
          )
        : null,
    ),
  );

  someProjectsAreSelected$ = this.appliedProjectIds$.pipe(
    map((ids) => ids.length !== 0),
  );

  singleProjectSlug$ = combineLatest([
    this.projects$,
    this.selectedProjectIds$,
  ]).pipe(
    map(([projects, ids]) => {
      if (ids.length === 1 && projects) {
        const matchedProject = projects.find(
          (project) => project.id === ids[0],
        );
        if (matchedProject) {
          return matchedProject.slug;
        }
        return false;
      }
      return false;
    }),
  );

  @ViewChild("expansionPanel", { static: false })
  expansionPanel?: MatExpansionPanel;

  @ViewChild("filterInput", { static: false })
  filterInput?: ElementRef<HTMLInputElement>;

  @HostListener("document:keydown", ["$event"]) onKeydownHandler(
    event: KeyboardEvent,
  ) {
    if (this.expansionPanel?.expanded) {
      if (event.key === "Escape") {
        this.resetPanel();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.moveDown();
      }
      if (event.key === "ArrowUp") {
        this.moveUp();
      }
    }
  }

  /** Close the project picker panel (if open) and remove all project filters */
  resetProjects() {
    this.closePanel();
    this.navigate(null);
  }

  moveDown() {
    const projectButtons = Array.from(
      document.querySelectorAll(".picker-button"),
    ) as HTMLElement[];
    // If the text box is focused, go to the first item
    if (this.filterInput?.nativeElement.id === document.activeElement?.id) {
      projectButtons[0]?.focus();
    } else {
      const indexOfActive = projectButtons.findIndex(
        (button) => button.id === document.activeElement?.id,
      );
      if (indexOfActive <= projectButtons.length - 2) {
        // If we're in the list items, go to the next list item
        projectButtons[indexOfActive + 1].focus();
      } else {
        // If we're in the last list item, go to the first item
        projectButtons[0].focus();
      }
    }
  }

  moveUp() {
    const projectButtons = Array.from(
      document.querySelectorAll(".picker-button"),
    ) as HTMLElement[];
    const indexOfActive = projectButtons.findIndex(
      (button) => button.id === document.activeElement?.id,
    );
    if (indexOfActive > 0) {
      // If we're in the list items, go to the previous list item
      projectButtons[indexOfActive - 1].focus();
    } else {
      // If we're in the first list item, go to the first item
      this.filterInput?.nativeElement.focus();
    }
  }

  navigate(project: string[] | null) {
    this.router.navigate([], {
      queryParams: { project: project ? project : null, cursor: null },
      queryParamsHandling: "merge",
    });
  }

  isSelected(projectId: number) {
    return !!this.selectedProjectIds.getValue().find((id) => id === projectId);
  }

  focusPanel() {
    this.filterInput?.nativeElement.focus();
  }

  selectProjectAndClose(projectId: number) {
    this.navigate([projectId.toString()]);
    this.selectedProjectIds.next([projectId]);
    this.expansionPanel?.close();
  }

  toggleProject(projectId: number) {
    const selectedIds = [...this.selectedProjectIds.getValue()];
    const idMatchIndex = selectedIds.indexOf(projectId);
    if (idMatchIndex > -1) {
      selectedIds.splice(idMatchIndex, 1);
    } else {
      selectedIds.push(projectId);
    }
    this.selectedProjectIds.next(selectedIds);
  }

  resetPanel() {
    if (this.appliedProjectIds !== undefined) {
      this.selectedProjectIds.next(this.appliedProjectIds);
      this.expansionPanel?.close();
    }
  }

  closePanel() {
    this.navigate(
      this.selectedProjectIds.getValue().map((id) => id.toString()),
    );
    this.expansionPanel?.close();
  }

  ngOnInit() {
    this.appliedProjectIds$.subscribe((ids) => {
      this.appliedProjectIds = ids;
    });

    this.route.params
      .pipe(
        map((params) => params["org-slug"]),
        filter((orgSlug: string) => orgSlug !== undefined),
        tap(() => this.expansionPanel?.close()),
      )
      .subscribe();
  }

  constructor(
    private organizationsService: OrganizationsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
}
