import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { AcceptInviteComponent } from "./accept-invite/accept-invite.component";
import { AcceptRoutingModule } from "./accept-routing.module";

@NgModule({
  declarations: [AcceptInviteComponent],
  imports: [CommonModule, AcceptRoutingModule, MatButtonModule, MatCardModule],
})
export class AcceptModule {}
