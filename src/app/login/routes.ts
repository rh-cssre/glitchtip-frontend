import { Route } from "@angular/router";
import { LoginComponent } from "./login.component";

export default [
  { path: "", component: LoginComponent },
  { path: ":provider", component: LoginComponent },
] as Route[];
