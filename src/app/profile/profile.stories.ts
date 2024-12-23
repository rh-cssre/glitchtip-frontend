// import { Story } from "@storybook/angular";
// import { ChangePasswordComponent } from "./change-password/change-password.component";
// import { of } from "rxjs";

// export default {
//   title: "Profile/Profile",
//   component: ChangePasswordComponent,
//   argTypes: {
//     loading: {
//       options: [true, false],
//     },
//     hasError: {
//       options: [true, false],
//     },
//     hasPasswordAuth: {
//       options: [true, false],
//     },
//   },
// };

// export const Template: Story = (args) => {
//   const { loading, hasError, hasPasswordAuth } = args;
//   const user = {
//     username: "rain@bow.com",
//     lastLogin: "2020-11-24T20:52:03.864975Z",
//     isSuperuser: true,
//     emails: [],
//     identities: [],
//     id: "1",
//     isActive: true,
//     name: "",
//     dateJoined: "2020-08-18T13:18:51.432490Z",
//     hasPasswordAuth: hasPasswordAuth,
//     email: "rain@bow.com",
//   };
//   return {
//     props: {
//       loading,
//       error: hasError ? "Server Error Message" : null,
//       user$: of(user),
//     },
//   };
// };

// export const ChangePassword = Template.bind({});
// ChangePassword.args = {
//   loading: false,
//   hasError: false,
//   hasPasswordAuth: true,
// };

export default {};
