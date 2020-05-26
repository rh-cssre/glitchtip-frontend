import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, text, select } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProfileComponent } from "./profile.component";
import { AuthButtonComponent } from "./auth-button/auth-button.component";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { UserService } from "../api/user/user.service";
import {
  OAuthService,
  UrlHelperService,
  OAuthLogger,
} from "angular-oauth2-oidc";
import { of } from "rxjs";
import { SharedModule } from "../shared/shared.module";
import { ConnectComponent } from "./connect/connect.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";

export default {
  title: "Profile",
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      providers: [
        GlitchTipOAuthService,
        UserService,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
      ],
      declarations: [
        AuthButtonComponent,
        ProfileComponent,
        ChangePasswordComponent,
      ],
    }),
    withKnobs,
  ],
};

export const profile = () => {
  const user = {
    pk: 5,
    email: "rain@bow.com",
    first_name: "",
    last_name: "",
    socialaccount_set: select("socialaccount_set", { None: [], Yes: [1] }, []),
  };
  return {
    component: ProfileComponent,
    props: {
      user$: of(user),
      isGithubConnected$: of(boolean("GitHub is connected", false)),
      isGitlabConnected$: of(boolean("GitLab is connected", false)),
      isGoogleConnected$: of(boolean("Google is connected", false)),
      isMicrosoftConnected$: of(boolean("Microsoft is connected", false)),
    },
  };
};

profile.story = {
  name: "Profile Page",
};

export const connect = () => ({
  component: ConnectComponent,
  props: {},
});

connect.story = {
  name: "Connect Page",
};

export const changepw = () => {
  const loadingBoolean = boolean("Loading", false);
  const errorText = text("Server Error Message", "");
  return {
    component: ChangePasswordComponent,
    props: {
      loading: loadingBoolean,
      error: errorText,
    },
  };
};

changepw.story = {
  name: "Change Password",
};
