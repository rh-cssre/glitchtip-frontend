import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  effect,
  computed,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { DatePipe, I18nPluralPipe } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectChange } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { IssuesService } from "../issues.service";
import { IssueStatus } from "../interfaces";
import { DaysAgoPipe, DaysOldPipe } from "../../shared/days-ago.pipe";
import { IssueZeroStatesComponent } from "../issue-zero-states/issue-zero-states.component";
import { ListFooterComponent } from "../../list-elements/list-footer/list-footer.component";
import { DataFilterBarComponent } from "../../list-elements/data-filter-bar/data-filter-bar.component";
import { ProjectFilterBarComponent } from "../../list-elements/project-filter-bar/project-filter-bar.component";
import { ListTitleComponent } from "../../list-elements/list-title/list-title.component";
import { OrganizationsService } from "src/app/api/organizations.service";

import type { components } from "src/app/api/api-schema";
import {
  stringArrAttribute,
  stringAttribute,
} from "src/app/shared/shared.utils";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { EnvironmentsService } from "src/app/api/environments.service";

type Issue = components["schemas"]["IssueSchema"];

@Component({
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ListTitleComponent,
    ProjectFilterBarComponent,
    MatTableModule,
    DataFilterBarComponent,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ListFooterComponent,
    IssueZeroStatesComponent,
    DatePipe,
    DaysAgoPipe,
    DaysOldPipe,
    I18nPluralPipe,
  ],
  providers: [IssuesService],
})
export class IssuesPageComponent implements OnInit, OnDestroy {
  dialog = inject(MatDialog);
  protected service = inject(IssuesService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  private organizationsService = inject(OrganizationsService);
  #environmentsService = inject(EnvironmentsService);

  orgSlug = input.required<string>({ alias: "org-slug" });
  cursor = input(undefined, { transform: stringAttribute });
  query = input(undefined, { transform: stringAttribute });
  start = input(undefined, { transform: stringAttribute });
  end = input(undefined, { transform: stringAttribute });
  sort = input(undefined, { transform: stringAttribute });
  projects = input([], { alias: "project", transform: stringArrAttribute });
  environment = input(undefined, { transform: stringAttribute });

  displayedColumns: string[] = ["select", "title", "events"];
  paginator = this.service.paginator;
  loading = this.service.loading;
  initialLoad = this.service.initialLoad;
  form = new FormGroup({
    query: new FormControl(""),
  });
  sortForm = new FormGroup({
    sort: new FormControl({
      value: "",
      disabled: true,
    }),
  });
  environmentForm = new FormGroup({
    environment: new FormControl(""),
  });
  dateForm = new FormGroup({
    startDate: new FormControl<Date | string>(""),
    endDate: new FormControl<Date | string>(""),
  });

  issues = this.service.issuesWithSelected;
  areAllSelected = this.service.areAllSelected;
  multipleProjectIssuesSelected = computed(() => {
    let selectedProjects = this.issues()
      .filter((issue) => issue.isSelected)
      .map((issue) => issue.project.id);
    let selectedProjectsSet = new Set(selectedProjects);
    return selectedProjectsSet.size > 1;
  });
  thereAreSelectedIssues = this.service.thereAreSelectedIssues;
  allResultsSelected = this.service.allResultsSelected;
  numberOfSelectedIssues = this.service.numberOfSelectedIssues;
  activeOrganizationProjects =
    this.organizationsService.activeOrganizationProjects;
  activeOrganization = this.organizationsService.activeOrganization;
  // errors = this.service.errors;
  eventCountPluralMapping: { [k: string]: string } = {
    "=1": "1 event",
    other: "# events",
  };
  sorts = [
    { param: "-last_seen", display: "Last Seen" },
    { param: "first_seen", display: "First Seen" },
    { param: "-count", display: "Most Frequent" },
    { param: "count", display: "Least Frequent" },
    { param: "-priority", display: "Highest Priority" },
    { param: "priority", display: "Lowest Priority" },
  ];

  /**
   * Corresponds to project picker/header nav/project IDs in the URL
   * If the count is zero, we show issues from all projects
   */
  appliedProjectCount = computed(() => this.projects().length);

  showBulkSelectProject = computed(() => {
    const searchHits = this.paginator()?.hits;

    const hits = searchHits && this.numberOfSelectedIssues() < searchHits;
    if (this.areAllSelected() && hits) {
      return true;
    }
    return false;
  });

  availableEnvironments = computed(() =>
    this.#environmentsService.environmentNames(),
  );
  // this.appliedProjectCount() !== 1
  //   ? this.organizationDetailService.organizationEnvironmentsProcessed()
  //   : this.projectEnvironmentsService.visibleEnvironments(),
  // );

  constructor() {
    effect(() => {
      this.service.updateParams({
        orgSlug: this.orgSlug(),
        cursor: this.cursor(),
        query: this.query() ?? "is:unresolved",
        start: this.start(),
        end: this.end(),
        sort: this.sort(),
        project: this.projects(),
        environment: this.environment(),
      });
    });
    effect(() => {
      const projects = this.projects();
      if (projects.length == 1) {
        const project = this.activeOrganizationProjects().find(
          (proj) => proj.id === projects[0],
        );
        if (project?.slug) {
          this.#environmentsService.projectSlug.set(project.slug);
        } else {
          this.#environmentsService.projectSlug.set(null);
        }
      } else {
        this.#environmentsService.projectSlug.set(null);
      }
    });
    effect(() =>
      this.issues().length === 0
        ? this.sortForm.controls.sort.disable()
        : this.sortForm.controls.sort.enable(),
    );
    effect(() =>
      this.availableEnvironments().length === 0
        ? this.environmentForm.controls.environment.disable()
        : this.environmentForm.controls.environment.enable(),
    );
    /**
     * When changing from one project to another, see if there is an environment
     * in the URL. If it doesn't match a project environment, reset the URL.
     */
    effect(() => {
      const project = this.projects();
      const environment = this.environment();
      const environments = this.availableEnvironments();
      if (
        project.length &&
        environment &&
        !environments.includes(environment)
      ) {
        this.environmentForm.setValue({ environment: null });
        this.router.navigate([], {
          queryParams: { environment: null },
          queryParamsHandling: "merge",
        });
      }
    });
    effect(() => {
      const query = this.query();
      this.form.setValue({
        query: query ?? "is:unresolved",
      });
    });
    effect(() => {
      const sort = this.sort();
      this.sortForm.setValue({
        sort: sort ?? "-last_seen",
      });
    });
    effect(() => {
      const environment = this.environment();
      this.environmentForm.setValue({
        environment: environment ?? "",
      });
    });
    effect(() => {
      const start = this.start();
      const end = this.end();
      this.dateForm.setValue({
        startDate: start ? new Date(start.replace("Z", "")) : null,
        endDate: end ? new Date(end.replace("Z", "")) : null,
      });
    });
  }

  ngOnInit(): void {
    this.#environmentsService.reload();
  }

  ngOnDestroy(): void {
    this.#environmentsService.projectSlug.set(null);
  }

  trackIssues(index: number, issue: Issue): string {
    return issue.id;
  }

  onDateFormSubmit(queryParams: object) {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: "merge",
    });
  }

  dateFormReset() {
    this.router.navigate([], {
      queryParams: {
        cursor: null,
        start: null,
        end: null,
      },
      queryParamsHandling: "merge",
    });
    this.dateForm.setValue({ startDate: null, endDate: null });
  }

  searchSubmit() {
    this.router.navigate([], {
      queryParams: {
        query: this.form.value.query,
        cursor: null,
      },
      queryParamsHandling: "merge",
    });
  }

  updateStatus(status: IssueStatus) {
    const allResultsSelected = this.allResultsSelected();
    const orgSlug = this.orgSlug();
    if (orgSlug) {
      if (allResultsSelected) {
        this.service.bulkUpdateStatus(
          status,
          orgSlug,
          this.projects(),
          this.query(),
          this.start(),
          this.end(),
          this.environment(),
        );
      } else {
        this.service.updateStatusByIssueId(orgSlug, status);
      }
    }
  }

  mergeSelectedIssues() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      restoreFocus: false,
      height: "200px",
      width: "350px",
      data: {
        title: $localize`Merge issues`,
        message: $localize`This action will merge your selected issues into a single issue.`,
        confirmText: $localize`Merge`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      const orgSlug = this.orgSlug();
      if (confirmed && orgSlug) {
        this.service.updateStatusByIssueId(orgSlug, "merge");
      }
    });
  }

  toggleCheck(issueId: number) {
    this.service.toggleSelectOne(issueId.toString());
  }

  toggleSelectAllOnPage() {
    this.service.toggleSelectAllOnPage();
  }

  selectAllResults() {
    this.service.selectAllResults();
  }

  clearSelectAllResults() {
    this.service.cancelAllResultsSelection();
  }

  sortByChanged(event: MatSelectChange) {
    this.router.navigate([], {
      queryParams: { cursor: null, sort: event.value },
      queryParamsHandling: "merge",
    });
  }

  filterByEnvironment(event: MatSelectChange) {
    this.router.navigate([], {
      queryParams: { cursor: null, environment: event.value },
      queryParamsHandling: "merge",
    });
  }
}
