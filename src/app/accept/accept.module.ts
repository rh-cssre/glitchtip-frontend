import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AcceptInviteComponent } from "./accept-invite/accept-invite.component";
import { AcceptRoutingModule } from "./accept-routing.module";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  declarations: [AcceptInviteComponent],
  imports: [CommonModule, AcceptRoutingModule, MaterialModule],
})
export class AcceptModule {}
