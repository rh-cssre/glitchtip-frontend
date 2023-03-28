import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import { NewMonitorComponent } from "./new-monitor/new-monitor.component";
import { MonitorDetailComponent } from "./monitor-detail/monitor-detail.component";
import { MonitorUpdateComponent } from "./monitor-update/monitor-update.component";

const routes: Routes = [
  { path: "", component: MonitorListComponent },
  { path: "new", component: NewMonitorComponent },
  {
    path: ":monitor-id",
    component: MonitorDetailComponent,
  },
  {
    path: ":monitor-id/update",
    component: MonitorUpdateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UptimeRoutingModule {}
