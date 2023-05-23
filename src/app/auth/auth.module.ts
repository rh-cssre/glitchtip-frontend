import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";

@NgModule({
    imports: [CommonModule, AuthRoutingModule, AuthComponent],
})
export class AuthModule {}
