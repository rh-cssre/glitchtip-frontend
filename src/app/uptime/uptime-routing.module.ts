import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";

const routes: Routes = [
  {
    path: "", component: MonitorListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UptimeRoutingModule { }
