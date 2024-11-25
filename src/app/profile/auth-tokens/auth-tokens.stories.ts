// import { Story } from "@storybook/angular";

// import { of } from "rxjs";
// import { AuthTokensComponent } from "./auth-tokens.component";

// export default {
//   title: "Profile/Auth Tokens",
//   component: AuthTokensComponent,
//   argTypes: {
//     authTokens: {
//       options: [true, false],
//     },
//     deleteLoading: {
//       options: ["First", "Second", "Third", "None"],
//       type: ["select"],
//     },
//     initialLoad: {
//       options: [true, false],
//     },
//   },
// };

// export const Template: Story = (args) => {
//   const { authTokens, deleteLoading, initialLoad } = args;

//   const authTokenData = [
//     {
//       scopes: ["project:read"],
//       dateCreated: "2020-12-08T14:55:29.700718Z",
//       label: "Test Token",
//       token: "2254a159205830ca3d033617546b1c4634ef1f58",
//       id: 26,
//     },
//     {
//       scopes: [
//         "project:read",
//         "project:write",
//         "project:admin",
//         "project:releases",
//         "team:read",
//         "team:write",
//         "team:admin",
//         "event:read",
//         "event:write",
//         "event:admin",
//         "org:read",
//         "org:write",
//         "org:admin",
//         "member:read",
//         "member:write",
//         "member:admin",
//       ],
//       dateCreated: "2020-12-08T14:55:17.320799Z",
//       label:
//         "Token with a really long that probably should not happen normally but it could because that's an option we have",
//       token: "a389e813ea6920ba93fa3416e4792c68988e5991",
//       id: 25,
//     },
//     {
//       scopes: ["team:write", "event:write", "member:write"],
//       dateCreated: "2020-12-08T14:54:41.443359Z",
//       label: "Write Token",
//       token: "f36c969bb5adb240b8a50d01fe653807719bf662",
//       id: 24,
//     },
//   ];

//   function selectTokens(choice: boolean) {
//     return choice ? authTokenData : [];
//   }

//   const deleteLoadingOptions: { [index: string]: any } = {
//     First: 26,
//     Second: 25,
//     Third: 24,
//     None: null,
//   };

//   return {
//     props: {
//       authTokens$: of(selectTokens(authTokens)),
//       deleteLoading$: of(deleteLoadingOptions[deleteLoading]),
//       initialLoad$: of(initialLoad),
//     },
//   };
// };

// export const AuthTokenDefault = Template.bind({});
// AuthTokenDefault.args = {
//   authTokens: true,
//   deleteLoading: "none",
//   initialLoad: true,
// };

export default {};
