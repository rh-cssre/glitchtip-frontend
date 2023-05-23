import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RegisterRoutingModule } from "./register-routing.module";
import { AuthSvgComponent } from "../shared/auth-svg/auth-svg.component";
import { InputMatcherDirective } from "../shared/input-matcher.directive";
import { LessAnnoyingErrorStateMatcherModule } from "../shared/less-annoying-error-state-matcher.module";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@NgModule({
    imports: [
        CommonModule,
        AuthSvgComponent,
        ReactiveFormsModule,
        RegisterRoutingModule,
        InputMatcherDirective,
        LessAnnoyingErrorStateMatcherModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        RegisterComponent,
    ],
})
export class RegisterModule {}
