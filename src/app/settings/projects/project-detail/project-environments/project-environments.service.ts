import { Injectable } from "@angular/core";
import { combineLatest, EMPTY } from "rxjs";
import { filter, map, mergeMap, takeWhile, tap } from "rxjs/operators";
import { ProjectEnvironment } from "src/app/api/organizations/organizations.interface";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { ProjectSettingsService } from "../../project-settings.service";
import { ProjectEnvironmentsAPIService } from "src/app/api/projects/project-environments-api.service";

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
  readonly initialLoad$ = this.getState$.pipe(map((data) => data.initialLoad));
  readonly toggleHiddenLoading$ = this.getState$.pipe(
    map((data) => data.toggleHiddenLoading)
  );
  readonly error$ = this.getState$.pipe(map((data) => data.error));
  readonly environments$ = this.getState$.pipe(
    map((data) => data.environments)
  );
  readonly sortedEnvironments$ = this.environments$.pipe(
    map((environments) => {
      if (environments.length === 0) return null;
      const visible = {
        heading: "Visible",
        environments: environments.filter(
          (environment) => environment.isHidden === false
        ),
      };
      const hidden = {
        heading: "Hidden",
        environments: environments.filter(
          (environment) => environment.isHidden === true
        ),
      };
      const sorted = [];
      if (visible.environments.length > 0) sorted.push(visible);
      if (hidden.environments.length > 0) sorted.push(hidden);
      return sorted;
    })
  );
  readonly visibleEnvironments$ = this.environments$.pipe(
    map((environments) =>
      environments
        .filter((environment) => environment.isHidden === false)
        .map((environment) => environment.name)
    )
  );
  readonly visibleEnvironmentsLoaded$ = this.getState$.pipe(
    filter(({ initialLoad }) => initialLoad === true),
    map((state) =>
      state.environments
        .filter((environment) => environment.isHidden === false)
        .map((environment) => environment.name)
    )
  );

  constructor(
    private projectEnvironmentsAPIService: ProjectEnvironmentsAPIService,
    private organizationsService: OrganizationsService,
    private projectSettingsService: ProjectSettingsService
  ) {
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
                })
              )
            );
        }
        return EMPTY;
      })
    );
  }

  retrieveEnvironmentsWithProperties(orgSlug: string, projectSlug: string) {
    return this.projectEnvironmentsAPIService.list(orgSlug, projectSlug).pipe(
      tap((environments) =>
        this.setState({
          environments: this.sortEnvironments(environments),
          initialLoad: true,
        })
      )
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
                })
              )
            );
        }
        return EMPTY;
      })
    );
  }

  private sortEnvironments(environments: ProjectEnvironment[]) {
    // https://stackoverflow.com/a/17387454/
    return environments.sort((a, b) =>
      a.isHidden === b.isHidden ? 0 : a.isHidden ? 1 : -1
    );
  }

  private updatedEnvironments(newEnvironment: ProjectEnvironment) {
    const currentEnvironments = this.state.getValue().environments;
    const environmentToReplace = currentEnvironments.findIndex(
      (currentEnvironment) => currentEnvironment.name === newEnvironment.name
    );
    currentEnvironments[environmentToReplace] = newEnvironment;
    return this.sortEnvironments(currentEnvironments);
  }
}
