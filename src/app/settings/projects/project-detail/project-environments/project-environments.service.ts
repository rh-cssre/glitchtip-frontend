import { Injectable, computed, inject } from "@angular/core";
import { combineLatest, EMPTY } from "rxjs";
import { mergeMap, takeWhile, tap } from "rxjs/operators";
import { ProjectEnvironment } from "src/app/api/organizations/organizations.interface";
import { ProjectSettingsService } from "../../project-settings.service";
import { ProjectEnvironmentsAPIService } from "src/app/api/projects/project-environments-api.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { toObservable } from "@angular/core/rxjs-interop";

interface ProjectsState {
  initialLoad: boolean;
  toggleHiddenLoading: number | null;
  error: string;
  environments: ProjectEnvironment[];
}

const initialState: ProjectsState = {
  initialLoad: false,
  toggleHiddenLoading: null,
  error: "",
  environments: [],
};

@Injectable({
  providedIn: "root",
})
export class ProjectEnvironmentsService extends StatefulService<ProjectsState> {
  private projectEnvironmentsAPIService = inject(ProjectEnvironmentsAPIService);
  private organizationsService = inject(OrganizationsService);
  private projectSettingsService = inject(ProjectSettingsService);

  readonly initialLoad = computed(() => this.state().initialLoad);
  readonly initialLoad$ = toObservable(this.initialLoad);

  readonly toggleHiddenLoading = computed(
    () => this.state().toggleHiddenLoading,
  );
  readonly toggleHiddenLoading$ = toObservable(this.toggleHiddenLoading);

  readonly error = computed(() => this.state().error);
  readonly error$ = toObservable(this.error);

  readonly environments = computed(() => this.state().environments);
  readonly environments$ = toObservable(this.environments);

  readonly sortedEnvironments = computed(() => {
    const environments = this.environments();
    if (environments.length === 0) return null;
    const visible = {
      heading: "Visible",
      environments: environments.filter(
        (environment) => environment.isHidden === false,
      ),
    };
    const hidden = {
      heading: "Hidden",
      environments: environments.filter(
        (environment) => environment.isHidden === true,
      ),
    };
    const sorted = [];
    if (visible.environments.length > 0) sorted.push(visible);
    if (hidden.environments.length > 0) sorted.push(hidden);
    return sorted;
  });
  readonly sortedEnvironments$ = toObservable(this.sortedEnvironments);

  readonly visibleEnvironments = computed(() => {
    return this.environments()
      .filter((environment) => environment.isHidden === false)
      .map((environment) => environment.name);
  });
  readonly visibleEnvironments$ = toObservable(this.visibleEnvironments);

  readonly visibleEnvironmentsLoaded = computed(() => {
    if (!this.initialLoad()) return [];
    return this.environments()
      .filter((environment) => environment.isHidden === false)
      .map((environment) => environment.name);
  });
  readonly visibleEnvironmentsLoaded$ = toObservable(
    this.visibleEnvironmentsLoaded,
  );

  constructor() {
    super(initialState);
  }

  retrieveEnvironments() {
    return combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
    ]).pipe(
      takeWhile(([orgSlug, projectSlug]) => !orgSlug || !projectSlug, true),
      mergeMap(([orgSlug, projectSlug]) => {
        if (orgSlug && projectSlug) {
          return this.projectEnvironmentsAPIService
            .list(orgSlug, projectSlug)
            .pipe(
              tap((environments) =>
                this.setState({
                  environments: this.sortEnvironments(environments),
                  initialLoad: true,
                }),
              ),
            );
        }
        return EMPTY;
      }),
    );
  }

  retrieveEnvironmentsWithProperties(orgSlug: string, projectSlug: string) {
    return this.projectEnvironmentsAPIService.list(orgSlug, projectSlug).pipe(
      tap((environments) =>
        this.setState({
          environments: this.sortEnvironments(environments),
          initialLoad: true,
        }),
      ),
    );
  }

  updateEnvironment(environment: ProjectEnvironment) {
    return combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
    ]).pipe(
      takeWhile(([orgSlug, projectSlug]) => !orgSlug || !projectSlug, true),
      mergeMap(([orgSlug, projectSlug]) => {
        if (orgSlug && projectSlug) {
          this.setState({ toggleHiddenLoading: environment.id });

          return this.projectEnvironmentsAPIService
            .update(orgSlug, projectSlug, environment)
            .pipe(
              tap((updatedEnvironment) =>
                this.setState({
                  environments: this.updatedEnvironments(updatedEnvironment),
                  toggleHiddenLoading: null,
                }),
              ),
            );
        }
        return EMPTY;
      }),
    );
  }

  private sortEnvironments(environments: ProjectEnvironment[]) {
    // https://stackoverflow.com/a/17387454/
    return environments.sort((a, b) =>
      a.isHidden === b.isHidden ? 0 : a.isHidden ? 1 : -1,
    );
  }

  private updatedEnvironments(newEnvironment: ProjectEnvironment) {
    const currentEnvironments = this.state().environments;
    const environmentToReplace = currentEnvironments.findIndex(
      (currentEnvironment) => currentEnvironment.name === newEnvironment.name,
    );
    currentEnvironments[environmentToReplace] = newEnvironment;
    return this.sortEnvironments(currentEnvironments);
  }
}
