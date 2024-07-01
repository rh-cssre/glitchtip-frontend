import { Route } from "@angular/router";
import { AuthComponent } from "./auth.component";

export default [{ path: ":provider", component: AuthComponent }] as Route[];
