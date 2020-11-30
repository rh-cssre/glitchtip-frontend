import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, select } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GlitchTipOAuthService } from "../../api/oauth/oauth.service";
import { UserService } from "../../api/user/user.service";
import { SharedModule } from "../../shared/shared.module";
import { SocialAuthComponent } from "./social-auth.component";
import { of } from "rxjs";
import { SettingsService } from "src/app/api/settings.service";

export default {
  title: "Profile/Social Auth",
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      providers: [GlitchTipOAuthService, UserService, SettingsService],
      declarations: [SocialAuthComponent],
    }),
    withKnobs,
  ],
};

export const socialAuth = () => {
  const loadingBoolean = select(
    "loading",
    { first: 3, second: 4, null: null },
    null
  );
  return {
    component: SocialAuthComponent,
    props: {
      disconnectLoading$: of(loadingBoolean),
      user$: of({
        username: "rain@bow.com",
        lastLogin: "2020-10-29T15:51:52.193929Z",
        isSuperuser: true,
        emails: [],
        identities: [
          {
            id: 3,
            provider: "google",
            uid: "secret",
            last_login: "2020-10-29T15:51:52.182486Z",
            date_joined: "2020-10-29T15:51:52.182546Z",
            email: "emily@burkesoftware.com",
            username: null,
          },
          {
            id: 4,
            provider: "google",
            uid: "secret",
            last_login: "2020-10-29T15:51:52.182486Z",
            date_joined: "2020-10-29T15:51:52.182546Z",
            email: "emilyjensen10@gmail.com",
            username: null,
          },
        ],
        id: "1",
        isActive: true,
        name: "",
        dateJoined: "2020-08-18T13:18:51.432490Z",
        hasPasswordAuth: true,
        email: "rain@bow.com",
      }),
      socialApps$: of([
        {
          provider: "google",
          name: "Google",
          client_id: "secrets secrets are no fun",
        },
      ]),
    },
  };
};

socialAuth.story = {
  name: "Social Auth",
};
