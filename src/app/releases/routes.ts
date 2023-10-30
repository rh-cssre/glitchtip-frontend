import { Route } from "@angular/router";
import { ReleaseDetailComponent } from "./release-detail/release-detail.component";
import { ReleasesComponent } from "./releases.component";

export default [
  {
    path: "",
    component: ReleasesComponent,
  },
  {
    path: ":version",
    component: ReleaseDetailComponent,
  },
] as Route[];
