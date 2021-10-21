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
}
