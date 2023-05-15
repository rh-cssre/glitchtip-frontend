import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ResetPasswordComponent } from "./reset-password.component";
import { ResetPasswordRoutingModule } from "./reset-password-routing.module";
import { SetNewPasswordComponent } from "./set-new-password/set-new-password.component";
import { InputMatcherDirective } from "../shared/input-matcher.directive";
import { LessAnnoyingErrorStateMatcherModule } from "../shared/less-annoying-error-state-matcher.module";
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [ResetPasswordComponent, SetNewPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ResetPasswordRoutingModule,
    InputMatcherDirective,
    LoadingButtonComponent,
    LessAnnoyingErrorStateMatcherModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class ResetPasswordModule {}
