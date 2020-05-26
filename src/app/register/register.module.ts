import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../shared/material.module";
import { RegisterRoutingModule } from "./register-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RegisterRoutingModule,
    SharedModule,
  ],
})
export class RegisterModule {}
