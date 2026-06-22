import {
  Component,
  OnInit,
  inject,
  effect,
  input,
  computed,
  ChangeDetectionStrategy,
} from "@angular/core";
import { I18nPluralPipe } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { PerformanceService } from "./transaction-groups-state";
import {
  stringArrAttribute,
  stringAttribute,
} from "src/app/shared/shared.utils";
import { HumanizeDurationPipe } from "../../shared/seconds-or-ms.pipe";
import { DataFilterBarComponent } from "../../list-elements/data-filter-bar/data-filter-bar.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { EnvironmentsService } from "src/app/api/environments.service";
import { MatCardModule } from "@angular/material/card";
import { ListAppBar } from "src/app/list-elements/list-app-bar/list-app-bar";
import { PaginationButtons } from "src/app/list-elements/pagination-buttons/pagination-buttons";

@Component({
  selector: "gt-transaction-groups",
  templateUrl: "./transaction-groups.html",
  styleUrls: ["./transaction-groups.scss"],
  imports: [
    I18nPluralPipe,
    MatTableModule,
    MatCardModule,
    DataFilterBarComponent,
    MatTooltipModule,
    RouterLink,
    HumanizeDurationPipe,
    ListAppBar,
    PaginationButtons,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [PerformanceService],
})
export class TransactionGroups implements OnInit {
  private organizationsService = inject(OrganizationsService);
  protected service = inject(PerformanceService);
  #environmentsService = inject(EnvironmentsService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  orgSlug = input.required<string>({ alias: "org-slug" });
  cursor = input(undefined, { transform: stringAttribute });
  query = input(undefined, { transform: stringAttribute });
  start = input(undefined, { transform: stringAttribute });
  end = input(undefined, { transform: stringAttribute });
  sort = input(undefined, { transform: stringAttribute });
  projects = input([], { alias: "project", transform: stringArrAttribute });
  environment = input(undefined, { transform: stringAttribute });

  paginator = this.service.paginator;
  displayedColumns = ["name-and-project", "avgDuration"];
  sortForm = new FormGroup({
    sort: new FormControl({
      value: "",
      disabled: true,
    }),
  });
  environmentForm = new FormGroup({
    environment: new FormControl({ value: "", disabled: true }),
  });
  searchForm = new FormGroup({
    query: new FormControl(""),
  });

  sorts = [
    { param: "-avg_duration", display: "Slowest" },
    { param: "avg_duration", display: "Fastest" },
    { param: "-count", display: "Most Frequent" },
    { param: "count", display: "Least Frequent" },
  ];
  tooltipDisabled = false;
  transactionCountPluralMapping: { [k: string]: string } = {
    "=1": "1 Transaction",
    other: "# Transactions",
  };

  environmentNames = this.#environmentsService.environmentNames;
  transactionGroupsDisplay = this.service.transactionGroupsDisplay;
  errors = this.service.errors;
  loading = this.service.loading;
  initialLoadComplete = this.service.initialLoadComplete;
  activeOrganizationProjects =
    this.organizationsService.activeOrganizationProjects;
  environments = this.#environmentsService.orgEnvironments;
  appliedProjectCount = computed(() => this.projects().length);

  constructor() {
    effect(() => {
      this.service.params.set({
        orgSlug: this.orgSlug(),
        cursor: this.cursor(),
        query: this.query(),
        start: this.start(),
        end: this.end(),
        sort: this.sort(),
        project: this.projects(),
        environment: this.environment(),
      });
    });

    effect(() =>
      this.environments().length === 0
        ? this.environmentForm.controls.environment.disable()
        : this.environmentForm.controls.environment.enable(),
    );

    effect(() =>
      this.transactionGroupsDisplay().length === 0
        ? this.sortForm.controls.sort.disable()
        : this.sortForm.controls.sort.enable(),
    );
  }

  checkForOverflow($event: Event) {
    const target = $event.target as HTMLElement;
    if (target.parentElement) {
      const maxWidth = target.closest("div")!.offsetWidth;
      const spans = target.parentElement.children;
      let totalWidth = 0;
      for (let i = 0; i < spans.length; i++) {
        if (spans[i] instanceof HTMLElement) {
          const span1 = spans[i] as HTMLElement;
          totalWidth += span1.offsetWidth;
        }
      }
      return totalWidth > maxWidth ? false : true;
    }
    return true;
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = this.checkForOverflow($event);
  }

  setTitleTooltip(group: { method: string; transaction: string; op: string }) {
    if (group.method) {
      return `${group.method} ${group.transaction}`;
    } else {
      return `${group.transaction} ${group.op}`;
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((_) => {
      const sort: string | undefined = this.route.snapshot.queryParams.sort;
      const query: string | undefined = this.route.snapshot.queryParams.query;
      this.sortForm.setValue({
        sort: sort !== undefined ? sort : "-avg_duration",
      });
      this.searchForm.setValue({
        query: query !== undefined ? query : "",
      });
    });
    this.#environmentsService.reload();
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

  searchSubmit() {
    this.router.navigate([], {
      queryParams: {
        query: this.searchForm.value.query,
        cursor: null,
      },
      queryParamsHandling: "merge",
    });
  }
}
