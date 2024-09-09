// import { Meta, StoryObj } from "@storybook/angular";
// import { of } from "rxjs";
// import { SocialAuthComponent } from "./social-auth.component";

// const meta: Meta<SocialAuthComponent> = {
//   title: "Profile/Social Auth",
//   component: SocialAuthComponent,
// };
// const loadingOptions: { [index: string]: any } = {
//   First: 3,
//   Second: 4,
//   None: null,
// };

// export default meta;
// type Story = StoryObj<SocialAuthComponent>;

// export const Default: Story = {
//   args: {
//     disconnectLoading$: of(loadingOptions["First"]),
//     user$: of({
//       username: "rain@bow.com",
//       lastLogin: "2020-10-29T15:51:52.193929Z",
//       isSuperuser: true,
//       emails: [],
//       identities: [
//         {
//           id: 3,
//           name: "",
//           provider: "google",
//           uid: "secret",
//           last_login: "2020-10-29T15:51:52.182486Z",
//           date_joined: "2020-10-29T15:51:52.182546Z",
//           email: "a@a.aa",
//           username: null,
//         },
//         {
//           id: 4,
//           name: "",
//           provider: "google",
//           uid: "secret",
//           last_login: "2020-10-29T15:51:52.182486Z",
//           date_joined: "2020-10-29T15:51:52.182546Z",
//           email: "b@b.bb",
//           username: null,
//         },
//       ],
//       id: "1",
//       isActive: true,
//       name: "",
//       dateJoined: "2020-08-18T13:18:51.432490Z",
//       hasPasswordAuth: true,
//       email: "rain@bow.com",
//     }),
//     socialApps$: of([
//       {
//         provider: "google",
//         name: "Google",
//         client_id: "secrets secrets are no fun",
//         authorize_url: "",
//         scopes: [],
//       },
//     ]),
//   },
// };
