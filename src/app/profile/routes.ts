import { Route } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";
import { AuthTokensComponent } from "./auth-tokens/auth-tokens.component";
import { NewTokenComponent } from "./auth-tokens/new-token/new-token.component";
import { Notifications } from "./notifications/notifications";
import { AccountComponent } from "./account/account.component";
import { MultiFactorAuthComponent } from "./multi-factor-auth/multi-factor-auth.component";
import { Wizard } from "./wizard/wizard";

export default [
  {
    path: "",
    component: ProfileComponent,
    children: [
      { path: "auth-tokens", component: AuthTokensComponent },
      { path: "auth-tokens/new", component: NewTokenComponent },

      { path: "", component: AccountComponent },
      { path: "notifications", component: Notifications },
      { path: "multi-factor-auth", component: MultiFactorAuthComponent },
      { path: "wizard/:hash", component: Wizard },
    ],
  },
  {
    path: "confirm-email/:key",
    component: ConfirmEmailComponent,
  },
] as Route[];
