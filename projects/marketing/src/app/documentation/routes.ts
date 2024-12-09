import { Route } from "@angular/router";
import { DocumentationIndexComponent } from "./documentation-index.component";
import { DocumentationPageComponent } from "./documentation-page.component";

export default [
  { path: "", component: DocumentationIndexComponent },
  { path: ":slug", component: DocumentationPageComponent },
] as Route[];
