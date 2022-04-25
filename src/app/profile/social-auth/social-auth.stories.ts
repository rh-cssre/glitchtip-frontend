import { moduleMetadata, Story } from "@storybook/angular";
import { GlitchTipOAuthService } from "../../api/oauth/oauth.service";
import { UserService } from "../../api/user/user.service";
import { SocialAuthComponent } from "./social-auth.component";
import { of } from "rxjs";
import { SettingsService } from "src/app/api/settings.service";
import { GlitchtipTestingModule } from "src/app/glitchtip-testing/glitchtip-testing.module";

export default {
  title: "Profile/Social Auth",
  component: SocialAuthComponent,
  decorators: [
    moduleMetadata({
      imports: [GlitchtipTestingModule],
      providers: [GlitchTipOAuthService, UserService, SettingsService],
      declarations: [SocialAuthComponent],
    }),
  ],
  argTypes: {
    loading: {
      options: ["First", "Second", "None"],
      control: { type: "select" },
    },
  },
};

export const socialAuth: Story = (args) => {
  const { loading } = args;
  const loadingOptions: { [index: string]: any } = {
    First: 3,
    Second: 4,
    None: null,
  };
  return {
    props: {
      disconnectLoading$: of(loadingOptions[loading]),
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
            email: "a@a.aa",
            username: null,
          },
          {
            id: 4,
            provider: "google",
            uid: "secret",
            last_login: "2020-10-29T15:51:52.182486Z",
            date_joined: "2020-10-29T15:51:52.182546Z",
            email: "b@b.bb",
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
