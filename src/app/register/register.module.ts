import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../shared/material.module";
import { RegisterRoutingModule } from "./register-routing.module";
import { InputMatcherDirective } from "./input-matcher.directive";

@NgModule({
  declarations: [RegisterComponent, InputMatcherDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RegisterRoutingModule,
  ],
})
export class RegisterModule {}
