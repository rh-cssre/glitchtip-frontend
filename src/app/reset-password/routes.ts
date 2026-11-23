import { Route } from "@angular/router";
import { ResetPasswordComponent } from "./reset-password.component";
import { SetNewPassword } from "./set-new-password/set-new-password";

export default [
  {
    path: "",
    component: ResetPasswordComponent,
  },
  {
    path: "set-new-password/:key",
    component: SetNewPassword,
  },
] as Route[];
