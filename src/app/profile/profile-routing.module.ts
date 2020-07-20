import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent,
  },
  {
    path: "confirm-email/:key",
    component: ConfirmEmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
