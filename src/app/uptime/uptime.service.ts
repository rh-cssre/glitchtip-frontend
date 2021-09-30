import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators"
import { StatefulService } from "../shared/stateful-service/stateful-service";
import { Monitor } from "./uptime.interfaces";
import { MonitorsAPIService } from "../api/monitors/monitors-api.service"

interface UptimeState {
  monitors: Monitor[]
}

const initialState: UptimeState = {
  monitors: []
}

@Injectable({
  providedIn: "root"
})

export class UptimeService extends StatefulService<UptimeState> {
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
