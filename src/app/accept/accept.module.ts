import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { AcceptInviteComponent } from "./accept-invite/accept-invite.component";
import { AcceptRoutingModule } from "./accept-routing.module";

@NgModule({
  declarations: [AcceptInviteComponent],
  imports: [CommonModule, AcceptRoutingModule, MatCardModule],
})
export class AcceptModule {}
