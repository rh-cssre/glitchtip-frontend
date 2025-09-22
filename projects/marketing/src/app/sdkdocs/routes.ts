import { Route } from "@angular/router";
import { SDKDocsIndexComponent } from "./sdkdocs-index.component";
import { SDKDocsComponent } from "./sdkdocs.component";

export default [
  { path: "", component: SDKDocsIndexComponent },
  { path: ":slug", component: SDKDocsComponent },
] as Route[];
