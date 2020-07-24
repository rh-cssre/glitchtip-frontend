import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, text, select } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProfileComponent } from "./profile.component";
import { AuthSvgComponent } from "../shared/auth-svg/auth-svg.component";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { UserService } from "../api/user/user.service";
import { SharedModule } from "../shared/shared.module";
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
      providers: [GlitchTipOAuthService, UserService],
      declarations: [
        AuthSvgComponent,
        ProfileComponent,
        ChangePasswordComponent,
      ],
    }),
    withKnobs,
  ],
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
