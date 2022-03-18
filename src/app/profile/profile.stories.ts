import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata, Story } from "@storybook/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProfileComponent } from "./profile.component";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { UserService } from "../api/user/user.service";
import { SharedModule } from "../shared/shared.module";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { of } from "rxjs";

export default {
  title: "Profile/Profile",
  component: ChangePasswordComponent,
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
  ],
  argTypes: {
    loading: {
      options: [true, false],
    },
    hasError: {
      options: [true, false],
    },
    hasPasswordAuth: {
      options: [true, false],
    },
  },
};

export const Template: Story = (args) => {
  const { loading, hasError, hasPasswordAuth } = args;
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
    hasPasswordAuth: hasPasswordAuth,
    email: "rain@bow.com",
  };
  return {
    props: {
      loading,
      error: hasError ? "Server Error Message" : null,
      user$: of(user),
    },
  };
};

export const ChangePassword = Template.bind({});
ChangePassword.args = {
  loading: false,
  hasError: false,
  hasPasswordAuth: true,
};
