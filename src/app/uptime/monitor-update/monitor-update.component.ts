import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
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
import { MonitorService, MonitorState } from "../monitor.service";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";

@Component({
  standalone: true,
  selector: "gt-monitor-update",
  templateUrl: "./monitor-update.component.html",
  styleUrls: ["./monitor-update.component.scss"],
  imports: [
    CommonModule,
    RouterModule,
    LoadingButtonComponent,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MonitorFormComponent,
    DetailHeaderComponent,
  ],
})
export class MonitorUpdateComponent
  extends StatefulBaseComponent<MonitorState, MonitorService>
  implements OnInit
{
  monitor$ = this.service.activeMonitor$;
  loading$ = this.service.editLoading$;
  error$ = this.service.error$;
  deleteLoading$ = this.service.deleteLoading$;

  constructor(
    protected service: MonitorService,
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
          }
        })
      )
    );
  }

  submit(formValues: MonitorInput) {
    this.service.editMonitor(formValues);
  }

  delete() {
    if (
      window.confirm(
        `Are you sure you want delete this monitor? You will permanently lose all associated uptime data.`
      )
    ) {
      this.service.deleteMonitor();
    }
  }
}
