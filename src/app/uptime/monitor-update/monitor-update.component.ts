import { Component, OnInit, inject, input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MonitorFormComponent } from "../monitor-form/monitor-form.component";
import { MonitorInput } from "../uptime.interfaces";
import { MonitorService, MonitorState } from "../monitor.service";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";

@Component({
  selector: "gt-monitor-update",
  templateUrl: "./monitor-update.component.html",
  styleUrls: ["./monitor-update.component.scss"],
  imports: [
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MonitorFormComponent,
    DetailHeaderComponent,
  ],
})
export class MonitorUpdateComponent
  extends StatefulComponent<MonitorState, MonitorService>
  implements OnInit
{
  protected service: MonitorService;
  monitorID = input.required<number>({ alias: "monitor-id" });

  monitor = this.service.activeMonitor;
  loading = this.service.editLoading;
  error = this.service.error;
  deleteLoading = this.service.deleteLoading;

  constructor() {
    const service = inject(MonitorService);
    super(service);
    this.service = service;
  }

  ngOnInit() {
    this.service.retrieveMonitorDetails(this.monitorID());
  }

  submit(formValues: MonitorInput) {
    this.service.editMonitor(formValues);
  }

  delete() {
    if (
      window.confirm(
        `Are you sure you want delete this monitor? You will permanently lose all associated uptime data.`,
      )
    ) {
      this.service.deleteMonitor();
    }
  }
}
