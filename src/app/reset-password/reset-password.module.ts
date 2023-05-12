import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ResetPasswordComponent } from "./reset-password.component";
import { ResetPasswordRoutingModule } from "./reset-password-routing.module";
import { SetNewPasswordComponent } from "./set-new-password/set-new-password.component";
import { InputMatcherDirective } from "../shared/input-matcher.directive";
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  declarations: [ResetPasswordComponent, SetNewPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ResetPasswordRoutingModule,
    InputMatcherDirective,
    MaterialModule,
    LoadingButtonComponent,
  ],
})
export class ResetPasswordModule {}
