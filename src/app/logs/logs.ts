import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from "@angular/core";
import { DatePipe, UpperCasePipe } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule, MatSelectChange } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { LogsService } from "./logs-state";
import { ListAppBar } from "../list-elements/list-app-bar/list-app-bar";
import { stringArrAttribute, stringAttribute } from "../shared/shared.utils";

@Component({
  templateUrl: "./logs.html",
  styleUrls: ["./logs.scss"],
  imports: [
    DatePipe,
    UpperCasePipe,
    ListAppBar,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  providers: [LogsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logs {
  protected service = inject(LogsService);
  protected router = inject(Router);

  orgSlug = input.required<string>({ alias: "org-slug" });
  cursor = input(undefined, { transform: stringAttribute });
  query = input(undefined, { transform: stringAttribute });
  start = input(undefined, { transform: stringAttribute });
  end = input(undefined, { transform: stringAttribute });
  level = input([], { transform: stringArrAttribute });
  service_ = input(undefined, {
    alias: "service",
    transform: stringAttribute,
  });
  projects = input([], { alias: "project", transform: stringArrAttribute });

  displayedColumns = ["level", "timestamp", "service", "body"];
  logs = this.service.logs;
  errors = this.service.errors;
  isLoading = this.service.isLoading;
  isLoadingMore = this.service.isLoadingMore;
  initialLoadComplete = this.service.initialLoadComplete;
  services = this.service.services;
  hasNextPage = this.service.hasNextPage;
  hitCount = this.service.hitCount;

  searchForm = new FormGroup({
    query: new FormControl(""),
  });
  levelForm = new FormGroup({
    level: new FormControl<string[]>([]),
  });
  serviceForm = new FormGroup({
    service: new FormControl<string>(""),
  });

  levelOptions = [
    { value: "trace", label: "Trace" },
    { value: "debug", label: "Debug" },
    { value: "info", label: "Info" },
    { value: "warn", label: "Warn" },
    { value: "error", label: "Error" },
    { value: "fatal", label: "Fatal" },
  ];

  serviceOptions = computed(() =>
    this.services().map((s: { name: string }) => ({
      value: s.name,
      label: s.name,
    })),
  );

  constructor() {
    // Reset accumulation when filters change (not cursor)
    effect(() => {
      // Read all filter signals to track them
      this.query();
      this.start();
      this.end();
      this.level();
      this.service_();
      this.projects();
      // Reset when any filter changes
      this.service.resetAccumulation();
    });

    // Sync URL params to service
    effect(() =>
      this.service.params.set({
        orgSlug: this.orgSlug(),
        cursor: this.cursor(),
        query: this.query(),
        start: this.start(),
        end: this.end(),
        level: this.level().length ? this.level() : undefined,
        service: this.service_(),
        project: this.projects().length ? this.projects() : undefined,
      }),
    );

    // Sync URL params to form controls
    effect(() => {
      const query = this.query();
      this.searchForm.setValue({ query: query ?? "" });
    });
    effect(() => {
      const level = this.level();
      this.levelForm.setValue({ level: level ?? [] });
    });
    effect(() => {
      const service = this.service_();
      this.serviceForm.setValue({ service: service ?? null });
    });
    effect(() =>
      this.services().length === 0
        ? this.serviceForm.disable()
        : this.serviceForm.enable(),
    );
  }

  loadMore() {
    this.service.loadMore();
  }

  searchSubmit() {
    this.router.navigate([], {
      queryParams: {
        query: this.searchForm.value.query || undefined,
        cursor: undefined,
      },
      queryParamsHandling: "merge",
    });
  }

  onLevelChange(event: MatSelectChange) {
    this.router.navigate([], {
      queryParams: {
        level: event.value?.length ? event.value : undefined,
        cursor: undefined,
      },
      queryParamsHandling: "merge",
    });
  }

  onServiceChange(event: MatSelectChange) {
    this.router.navigate([], {
      queryParams: {
        service: event.value || undefined,
        cursor: undefined,
      },
      queryParamsHandling: "merge",
    });
  }

  clearFilters() {
    this.router.navigate([], {
      queryParams: {
        query: undefined,
        level: undefined,
        service: undefined,
        start: undefined,
        end: undefined,
        project: undefined,
        cursor: undefined,
      },
    });
  }
}
