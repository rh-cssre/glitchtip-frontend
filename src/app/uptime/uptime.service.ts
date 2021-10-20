import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators"
import { 
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState 
} from "../shared/stateful-service/pagination-stateful-service";
import { Monitor } from "./uptime.interfaces";
import { MonitorsAPIService } from "../api/monitors/monitors-api.service"

export interface UptimeState extends PaginationStatefulServiceState{
  monitors: Monitor[]
}

const initialState: UptimeState = {
  monitors: [],
  pagination: initialPaginationState,
}

@Injectable({
  providedIn: "root"
})

export class UptimeService extends PaginationStatefulService<UptimeState> {
  monitors$ = this.getState$.pipe(map((state) => state.monitors));

  constructor(
    private monitorsAPIService: MonitorsAPIService
  ) {
    super(initialState)
  }

  getMonitors(
    orgSlug: string,
  ) {
    this.retrieveMonitors(
      orgSlug,
    ).toPromise();
  }

  private retrieveMonitors(
    organizationSlug?: string,
  ) {
    return this.monitorsAPIService
      .list(
        organizationSlug
      )
      .pipe(
        tap((res) => {
          this.setState({ monitors: res.body! })
      }))
  }
}
