import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, select } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { SharedModule } from "src/app/shared/shared.module";
import { ProfileComponent } from "../profile.component";
import { AuthTokensComponent } from "./auth-tokens.component";

export default {
  title: "Profile/Auth Tokens",
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [ProfileComponent],
    }),
    withKnobs,
  ],
};

export const authTokens = () => {
  const authTokenData = [
    {
      scopes: ["project:read"],
      dateCreated: "2020-12-08T14:55:29.700718Z",
      label: "Test Token",
      token: "2254a159205830ca3d033617546b1c4634ef1f58",
      id: 26,
    },
    {
      scopes: [
        "project:read",
        "project:write",
        "project:admin",
        "project:releases",
        "team:read",
        "team:write",
        "team:admin",
        "event:read",
        "event:write",
        "event:admin",
        "org:read",
        "org:write",
        "org:admin",
        "member:read",
        "member:write",
        "member:admin",
      ],
      dateCreated: "2020-12-08T14:55:17.320799Z",
      label:
        "Token with a really long that probably should not happen normally but it could because that's an option we have",
      token: "a389e813ea6920ba93fa3416e4792c68988e5991",
      id: 25,
    },
    {
      scopes: ["team:write", "event:write", "member:write"],
      dateCreated: "2020-12-08T14:54:41.443359Z",
      label: "Write Token",
      token: "f36c969bb5adb240b8a50d01fe653807719bf662",
      id: 24,
    },
  ];
  const statesOptions = {
    empty: [],
    hasTokens: authTokenData,
  };
  return {
    component: AuthTokensComponent,
    props: {
      authTokens$: of(select("States", statesOptions as any, [])),
      deleteLoading$: of(
        select(
          "loading",
          { first: 24, second: 25, third: 26, none: null },
          null
        )
      ),
      initialLoad$: of(boolean("Initial Load", true)),
    },
  };
};

authTokens.story = {
  name: "Auth Tokens",
};
