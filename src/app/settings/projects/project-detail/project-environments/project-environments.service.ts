import { Injectable } from "@angular/core";
import { combineLatest, EMPTY } from "rxjs";
import { map, mergeMap, takeWhile, tap } from "rxjs/operators";
import { ProjectEnvironment } from "src/app/api/organizations/organizations.interface";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ProjectsAPIService } from "src/app/api/projects/projects-api.service";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { ProjectSettingsService } from "../../project-settings.service";

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
      return [
        {
          heading: "Visible",
          environments: environments.filter(
            (environment) => environment.isHidden === false
          ),
        },
        {
          heading: "Hidden",
          environments: environments.filter(
            (environment) => environment.isHidden === true
          ),
        },
      ];
    })
  );

  constructor(
    private projectsAPIService: ProjectsAPIService,
    private organizationsService: OrganizationsService,
    private projectSettingsService: ProjectSettingsService
  ) {
    super(initialState);
  }

  retrieveEnvironments() {
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
    ])
      .pipe(
        mergeMap(([orgSlug, projectSlug]) => {
          if (orgSlug && projectSlug) {
            return this.projectsAPIService
              .listEnvironments(orgSlug, projectSlug)
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
      )
      .subscribe();
  }

  updateEnvironment(environment: ProjectEnvironment) {
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
    ])
      .pipe(
        takeWhile(([orgSlug, projectSlug]) => !orgSlug || !projectSlug, true),
        mergeMap(([orgSlug, projectSlug]) => {
          if (orgSlug && projectSlug) {
            this.setState({ toggleHiddenLoading: environment.id });

            return this.projectsAPIService
              .updateEnvironment(orgSlug, projectSlug, environment)
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
      )
      .subscribe();
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
