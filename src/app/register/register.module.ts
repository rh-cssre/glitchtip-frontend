import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RegisterRoutingModule } from "./register-routing.module";
import { AuthSvgComponent } from "../shared/auth-svg/auth-svg.component";
import { InputMatcherDirective } from "../shared/input-matcher.directive";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    AuthSvgComponent,
    ReactiveFormsModule,
    RegisterRoutingModule,
    InputMatcherDirective,
    MatInputModule,
    MatCardModule,
  ],
})
export class RegisterModule {}
