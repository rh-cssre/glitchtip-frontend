import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";
import { AuthTokensComponent } from "./auth-tokens/auth-tokens.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { AccountComponent } from "./account/account.component";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    children: [
      { path: "", component: AccountComponent },
      { path: "auth-tokens", component: AuthTokensComponent },
      { path: "notifications", component: NotificationsComponent },
    ],
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
