import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ResetPasswordComponent } from "./reset-password.component";
import { SetNewPasswordComponent } from "./set-new-password/set-new-password.component";

const routes: Routes = [
  {
    path: "",
    component: ResetPasswordComponent,
  },
  {
    path: "set-new-password/:uidb64/:token",
    component: SetNewPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordRoutingModule {}
