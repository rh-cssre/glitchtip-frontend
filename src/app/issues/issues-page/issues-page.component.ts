import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  input,
  effect,
  computed,
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
import { lastValueFrom } from "rxjs";
import { IssuesService } from "../issues.service";
import { IssueStatus } from "../interfaces";
import { ProjectEnvironmentsService } from "src/app/settings/projects/project-detail/project-environments/project-environments.service";
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
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";

type Issue = components["schemas"]["IssueSchema"];

@Component({
  selector: "gt-issues-page",
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
export class IssuesPageComponent implements OnDestroy {
  dialog = inject(MatDialog);
  protected service = inject(IssuesService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private projectEnvironmentsService = inject(ProjectEnvironmentsService);

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
    this.appliedProjectCount() !== 1
      ? this.organizationDetailService.organizationEnvironmentsProcessed()
      : this.projectEnvironmentsService.visibleEnvironments(),
  );

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
    effect(() => {
      const project = this.projects();
      const firstProjectId = project ? project[0] : null;
      const orgSlug = this.orgSlug();
      const projectSlug = this.organizationsService
        .activeOrganizationProjects()
        ?.find(
          (orgProject) => orgProject.id.toString() === firstProjectId,
        )?.slug;
      if (orgSlug) {
        lastValueFrom(
          this.organizationDetailService.getOrganizationEnvironments(orgSlug),
        );
      }
      if (orgSlug && projectSlug) {
        lastValueFrom(
          this.projectEnvironmentsService.retrieveEnvironmentsWithProperties(
            orgSlug,
            projectSlug,
          ),
        );
      }
    });
    /**
     * When changing from one project to another, see if there is an environment
     * in the URL. If it doesn't match a project environment, reset the URL.
     */
    effect(() => {
      const projectEnvironments =
        this.projectEnvironmentsService.visibleEnvironmentsLoaded();
      const project = this.projects();
      const environment = this.environment();
      if (
        project.length &&
        environment &&
        !projectEnvironments.includes(environment)
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

  ngOnDestroy() {
    this.projectEnvironmentsService.clearState();
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
