import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProfileComponent } from "./profile.component";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { UserService } from "../api/user/user.service";
import { SharedModule } from "../shared/shared.module";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { of } from "rxjs";

export default {
  title: "Profile/Profile",
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      providers: [GlitchTipOAuthService, UserService],
      declarations: [ProfileComponent, ChangePasswordComponent],
    }),
    withKnobs,
  ],
};

export const changepw = () => {
  const loadingBoolean = boolean("Loading", false);
  const errorText = text("Server Error Message", "");
  const user = {
    username: "rain@bow.com",
    lastLogin: "2020-11-24T20:52:03.864975Z",
    isSuperuser: true,
    emails: [],
    identities: [],
    id: "1",
    isActive: true,
    name: "",
    dateJoined: "2020-08-18T13:18:51.432490Z",
    hasPasswordAuth: boolean("Has Password Auth", true),
    email: "rain@bow.com",
  };
  return {
    component: ChangePasswordComponent,
    props: {
      loading: loadingBoolean,
      error: errorText,
      user$: of(user),
    },
  };
};

changepw.story = {
  name: "Change Password",
};
