import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";
import { AuthTokensComponent } from "./auth-tokens/auth-tokens.component";
import { NewTokenComponent } from "./auth-tokens/new-token/new-token.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { AccountComponent } from "./account/account.component";
import { MultiFactorAuthComponent } from "./multi-factor-auth/multi-factor-auth.component";
import { WizardComponent } from "./wizard/wizard.component";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    children: [
      { path: "auth-tokens", component: AuthTokensComponent },
      { path: "auth-tokens/new", component: NewTokenComponent },

      { path: "", component: AccountComponent },
      { path: "notifications", component: NotificationsComponent },
      { path: "multi-factor-auth", component: MultiFactorAuthComponent },
      { path: "wizard/:hash", component: WizardComponent },
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
