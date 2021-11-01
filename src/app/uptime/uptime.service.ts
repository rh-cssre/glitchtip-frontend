import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators"
import { 
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState 
} from "../shared/stateful-service/pagination-stateful-service";
import { Monitor, NewMonitor } from "./uptime.interfaces";
import { Environment } from "../api/organizations/organizations.interface";
import { MonitorsAPIService } from "../api/monitors/monitors-api.service";
import { ProjectsAPIService } from "../api/projects/projects-api.service";

export interface UptimeState extends PaginationStatefulServiceState{
  monitors: Monitor[],
  projectEnvironments: Environment[]
}

const initialState: UptimeState = {
  monitors: [],
  pagination: initialPaginationState,
  projectEnvironments: [],
}

@Injectable({
  providedIn: "root"
})

export class UptimeService extends PaginationStatefulService<UptimeState> {
  monitors$ = this.getState$.pipe(map((state) => state.monitors));
  projectEnvironments$ = this.getState$.pipe(map((state) => state.projectEnvironments));

  constructor(
    private monitorsAPIService: MonitorsAPIService,
    private projectsAPIService: ProjectsAPIService
  ) {
    super(initialState)
  }

  createMonitor(monitor: NewMonitor, orgSlug: string) {
    return this.monitorsAPIService
    .createMonitor(orgSlug, monitor)
    .pipe(
      tap(() => console.log("some handling stuff"))
    )
  }

  getMonitors(
    orgSlug: string,
    cursor?: string | undefined
  ) {
    this.retrieveMonitors(
      orgSlug,
      cursor,
    ).toPromise();
  }


  private retrieveMonitors(
    organizationSlug?: string,
    cursor?: string | undefined
  ) {
    return this.monitorsAPIService
      .list(
        organizationSlug,
        cursor
      )
      .pipe(
        tap((res) => {
          this.setStateAndPagination({ monitors: res.body! }, res)
      }))
  }

  getProjectEnvironments(
    orgSlug: string,
    projectSlug: string
  ) {
    this.retrieveProjectEnvironments(
      orgSlug,
      projectSlug,
    ).toPromise();
  }


  private retrieveProjectEnvironments(
    orgSlug: string,
    projectSlug: string
  ) {
    return this.projectsAPIService
      .listEnvironments(
        orgSlug,
        projectSlug
      )
      .pipe(
        tap((res) => {
          this.setState({ projectEnvironments: res })
      }))
  }
}
