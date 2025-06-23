import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
  HostListener,
  ElementRef,
  inject,
  signal,
  computed,
} from "@angular/core";
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
import { combineLatest } from "rxjs";
import { FormControl } from "@angular/forms";
import { OrganizationProject } from "src/app/api/projects/projects-api.interfaces";
import { Router, ActivatedRoute } from "@angular/router";
import { MatExpansionPanel } from "@angular/material/expansion";
import { normalizeProjectParams } from "src/app/shared/shared.utils";
import { OrganizationsService } from "src/app/api/organizations.service";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "gt-project-filter-bar",
  imports: [
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
  private organizationsService = inject(OrganizationsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  orgSlug = this.organizationsService.activeOrganizationSlug;
  /** All projects available */
  projects = this.organizationsService.activeOrganizationProjects;
  projects$ = toObservable(
    this.organizationsService.activeOrganizationProjects,
  );

  /** Projects that are selected in this component but not yet applied */
  selectedProjectIds = signal<number[]>([]);

  /** Observable of selectedProjectIds, intended to separate concerns */
  selectedProjectIds$ = toObservable(this.selectedProjectIds);

  /** Projects that were previously selected and applied */
  appliedProjectIds$ = this.route.queryParams.pipe(
    map((params) => {
      const normalizedParams = normalizeProjectParams(params.project);
      this.selectedProjectIds.set(normalizedParams);
      return normalizedParams;
    }),
  );
  appliedProjectIds = toSignal(this.appliedProjectIds$);

  _appliedProjectIds?: number[];

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
            .map(
              (id) =>
                projects?.find((project) => id.toString() === project.id)?.name,
            )
            .join(", ");
      }
    }),
  );
  selectedProjectsString = toSignal(this.selectedProjectsString$);

  selectedAndAppliedIdsAreEqual = computed(() => {
    const selected = this.selectedProjectIds();
    const applied = this.appliedProjectIds();
    return selected?.sort().join(",") === applied?.sort().join(",");
  });

  //** Yikes delete this please */
  forceString(value: string | number) {
    return String(value);
  }

  /** Used to filter project names */
  filterProjectInput = new FormControl();

  /** Projects that are filtered via the text field form control */
  filteredProjects$ = combineLatest([
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
  filteredProjects = toSignal(this.filteredProjects$);

  someProjectsAreSelected = computed(
    () => this.appliedProjectIds()?.length !== 0,
  );

  singleProjectSlug = computed(() => {
    const projects = this.projects();
    const ids = this.selectedProjectIds();

    if (ids.length === 1 && projects) {
      const matchedProject = projects.find(
        (project) => project.id === ids[0].toString(),
      );
      if (matchedProject) {
        return matchedProject.slug;
      }
      return false;
    }
    return false;
  });

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

  isSelected(projectId: string) {
    return !!this.selectedProjectIds().find(
      (id) => id.toString() === projectId,
    );
  }

  focusPanel() {
    this.filterInput?.nativeElement.focus();
  }

  selectProjectAndClose(projectId: string) {
    this.navigate([projectId.toString()]);
    this.selectedProjectIds.set([parseInt(projectId)]);
    this.expansionPanel?.close();
  }

  toggleProject(projectId: string) {
    const selectedIds = [...this.selectedProjectIds()];
    const idMatchIndex = selectedIds.indexOf(parseInt(projectId));
    if (idMatchIndex > -1) {
      selectedIds.splice(idMatchIndex, 1);
    } else {
      selectedIds.push(parseInt(projectId));
    }
    this.selectedProjectIds.set(selectedIds);
  }

  resetPanel() {
    if (this._appliedProjectIds !== undefined) {
      this.selectedProjectIds.set(this._appliedProjectIds);
      this.expansionPanel?.close();
    }
  }

  closePanel() {
    this.navigate(this.selectedProjectIds().map((id) => id.toString()));
    this.expansionPanel?.close();
  }

  ngOnInit() {
    this.appliedProjectIds$.subscribe((ids) => {
      this._appliedProjectIds = ids;
    });

    this.route.params
      .pipe(
        map((params) => params["org-slug"]),
        filter((orgSlug: string) => orgSlug !== undefined),
        tap(() => this.expansionPanel?.close()),
      )
      .subscribe();
  }
}
