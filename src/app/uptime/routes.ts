import { Route } from "@angular/router";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import { NewMonitorComponent } from "./new-monitor/new-monitor.component";
import { MonitorDetailComponent } from "./monitor-detail/monitor-detail.component";
import { MonitorUpdateComponent } from "./monitor-update/monitor-update.component";
import { monitorListResolver } from "./monitor-list/monitor-list.resolver";

export default [
  {
    path: "",
    component: MonitorListComponent,
    resolve: [monitorListResolver],
    runGuardsAndResolvers: "always",
  },
  { path: "new", component: NewMonitorComponent },
  {
    path: ":monitor-id",
    component: MonitorDetailComponent,
  },
  {
    path: ":monitor-id/update",
    component: MonitorUpdateComponent,
  },
] as Route[];
