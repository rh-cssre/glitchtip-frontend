import { Route } from "@angular/router";
import { ResetPasswordComponent } from "./reset-password.component";
import { SetNewPasswordComponent } from "./set-new-password/set-new-password.component";

export default [
  {
    path: "",
    component: ResetPasswordComponent,
  },
  {
    path: "set-new-password/:key",
    component: SetNewPasswordComponent,
  },
] as Route[];
