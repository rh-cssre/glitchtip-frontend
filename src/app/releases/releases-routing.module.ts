import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReleaseDetailComponent } from "./release-detail/release-detail.component";
import { ReleasesComponent } from "./releases.component";

const routes: Routes = [
  {
    path: "",
    component: ReleasesComponent,
  },
  {
    path: ":version",
    component: ReleaseDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReleasesRoutingModule {}
