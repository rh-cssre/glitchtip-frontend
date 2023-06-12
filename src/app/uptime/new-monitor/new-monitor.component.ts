import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MonitorFormComponent } from "../monitor-form/monitor-form.component";
import { MonitorInput } from "../uptime.interfaces";
import { MonitorService } from "../monitor.service";

@Component({
  standalone: true,
  selector: "gt-new-monitor",
  templateUrl: "./new-monitor.component.html",
  styleUrls: ["./new-monitor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterModule,
    MonitorFormComponent,
    MatButtonModule,
    MatIconModule,
  ],
})
export class NewMonitorComponent {
  error$ = this.monitorService.error$;
  loading$ = this.monitorService.createLoading$;

  constructor(private monitorService: MonitorService) {}

  submit(formValues: MonitorInput) {
    this.monitorService.createMonitor(formValues);
  }
}
