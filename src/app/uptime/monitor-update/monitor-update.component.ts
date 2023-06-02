import { Component, OnInit } from "@angular/core";
import { NgIf, AsyncPipe } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { tap, filter, take } from "rxjs/operators";
import { lastValueFrom } from "rxjs";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MonitorFormComponent } from "../monitor-form/monitor-form.component";
import { MonitorInput } from "../uptime.interfaces";
import { UptimeService, UptimeState } from "../uptime.service";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";

@Component({
  standalone: true,
  selector: "gt-monitor-update",
  templateUrl: "./monitor-update.component.html",
  styleUrls: ["./monitor-update.component.scss"],
  imports: [
    AsyncPipe,
    NgIf,
    RouterModule,
    LoadingButtonComponent,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MonitorFormComponent,
  ],
})
export class MonitorUpdateComponent
  extends StatefulBaseComponent<UptimeState, UptimeService>
  implements OnInit
{
  monitor$ = this.service.activeMonitor$;
  loading$ = this.service.editLoading$;
  error$ = this.service.error$;
  deleteLoading$ = this.service.deleteLoading$;

  constructor(
    protected service: UptimeService,
    protected route: ActivatedRoute
  ) {
    super(service);
  }

  ngOnInit() {
    lastValueFrom(
      this.route.params.pipe(
        filter((params) => !!params),
        take(1),
        tap((params) => {
          const orgSlug = params["org-slug"];
          const monitorId = params["monitor-id"];
          if (orgSlug && monitorId) {
            this.service.retrieveMonitorDetails(orgSlug, monitorId);
            this.service.callSubscriptionDetails();
          }
        })
      )
    );
  }

  submit(formValues: MonitorInput) {
    this.service.editMonitor(formValues);
  }

  deleteMonitor() {
    if (
      window.confirm(
        `Are you sure you want to remove this monitor? You will lose all of its uptime check history.`
      )
    ) {
      this.service.deleteMonitor();
    }
  }
}
