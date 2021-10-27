import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import { NewMonitorComponent } from "./new-monitor/new-monitor.component";

const routes: Routes = [
  { path: "", component: MonitorListComponent},
  { path: "new", component: NewMonitorComponent},
  // {
  //   path: ":monitor-id",
  //   component: MonitorDetailComponent,
  //   children: [
  //     { path: "", component: MonCheckDetailComponent },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UptimeRoutingModule { }
