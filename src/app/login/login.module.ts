import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatCardModule } from "@angular/material/card";
import {
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule
} from "@angular/material";

import { ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login.component";
import { LoginRoutingModule } from "./login-routing.module";
import { AuthModule } from "../api/auth/auth.module";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    AuthModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class LoginModule {}
