import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile.component";
import { ConnectComponent } from "./connect/connect.component";
import { SharedModule } from "../shared/shared.module";
import { AuthButtonComponent } from "./auth-button/auth-button.component";

@NgModule({
  declarations: [ProfileComponent, ConnectComponent, AuthButtonComponent],
  imports: [CommonModule, ProfileRoutingModule, SharedModule],
})
export class ProfileModule {}
