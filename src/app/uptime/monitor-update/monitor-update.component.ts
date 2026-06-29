import {
  Component,
  OnInit,
  inject,
  input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MonitorFormComponent } from "../monitor-form/monitor-form.component";
import { MonitorInput } from "../uptime.interfaces";
import { MonitorService, MonitorState } from "../monitor.service";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";

@Component({
  selector: "gt-monitor-update",
  templateUrl: "./monitor-update.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MonitorFormComponent,
    BackLinkComponent,
    TopAppBar,
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
