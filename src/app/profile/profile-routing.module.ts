import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { ConnectComponent } from "./connect/connect.component";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent
  },
  {
    path: "connect/:provider",
    component: ConnectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
