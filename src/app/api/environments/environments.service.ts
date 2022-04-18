import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Environment } from "../organizations/organizations.interface";
import { EnvironmentsAPIService } from "./environments-api.service";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";

interface ProjectsState {
  organizationEnvironments: Environment[];
}

const initialState: ProjectsState = {
  organizationEnvironments: [],
};

@Injectable({
  providedIn: "root",
})
export class EnvironmentsService extends StatefulService<ProjectsState> {
  readonly organizationEnvironments$ = this.getState$.pipe(
    map((data) => data.organizationEnvironments)
  );

  readonly organizationEnvironmentsProcessed$ =
    this.organizationEnvironments$.pipe(
      map((environments) =>
        environments.reduce(
          (accumulator, environment) => [
            ...accumulator,
            ...(!accumulator.includes(environment.name)
              ? [environment.name]
              : []),
          ],
          [] as string[]
        )
      )
    );

  constructor(private environmentsAPIService: EnvironmentsAPIService) {
    super(initialState);
  }

  getOrganizationEnvironments(orgSlug: string) {
    return this.retrieveOrganizationEnvironments(orgSlug);
  }

  private retrieveOrganizationEnvironments(orgSlug: string) {
    return this.environmentsAPIService.list(orgSlug).pipe(
      tap((environments) => {
        this.setState({
          organizationEnvironments: environments,
        });
      })
    );
  }
}
