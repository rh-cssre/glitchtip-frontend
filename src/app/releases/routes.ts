import { Route } from "@angular/router";
import { ReleaseDetail } from "./release-detail/release-detail";
import { Releases } from "./releases";

export default [
  {
    path: "",
    component: Releases,
  },
  {
    path: ":version",
    component: ReleaseDetail,
  },
] as Route[];
