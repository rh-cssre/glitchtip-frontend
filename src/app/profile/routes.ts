import { Route } from "@angular/router";
import { ProfilWrapperComponent } from "./profile-wrapper.component";
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
    component: ProfilWrapperComponent,
    // Each page's title shows in the top bar; same strings as the nav items.
    children: [
      {
        path: "",
        component: AccountComponent,
        data: { title: $localize`Account` },
      },
      {
        path: "auth-tokens",
        component: AuthTokensComponent,
        data: { title: $localize`Auth tokens` },
      },
      {
        path: "auth-tokens/new",
        component: NewTokenComponent,
        data: { title: $localize`Auth tokens` },
      },
      {
        path: "notifications",
        component: Notifications,
        data: { title: $localize`Notifications` },
      },
      {
        path: "multi-factor-auth",
        component: MultiFactorAuthComponent,
        data: { title: $localize`MFA` },
      },
      {
        path: "wizard/:hash",
        component: Wizard,
        data: { title: $localize`Setup wizard` },
      },
    ],
  },
  {
    path: "confirm-email/:key",
    component: ConfirmEmailComponent,
  },
] as Route[];
