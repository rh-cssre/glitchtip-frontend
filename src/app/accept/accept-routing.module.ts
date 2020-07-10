import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AcceptInviteComponent } from "./accept-invite/accept-invite.component";

const routes: Routes = [{ path: "", component: AcceptInviteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptRoutingModule {}
