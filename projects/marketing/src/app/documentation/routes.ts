import { Route } from "@angular/router";
import { DocumentationLayoutComponent } from "./documentation-layout.component";
import { DocumentationIndexComponent } from "./documentation-index.component";
import { DocumentationPageComponent } from "./documentation-page.component";

export default [
  {
    path: "",
    component: DocumentationLayoutComponent,
    children: [
      { path: "", component: DocumentationIndexComponent },
      { path: ":slug", component: DocumentationPageComponent },
    ],
  },
] as Route[];
