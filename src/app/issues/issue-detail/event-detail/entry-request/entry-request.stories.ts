// import { Story } from "@storybook/angular";
// import { of } from "rxjs";

// import { EntryRequestComponent } from "./entry-request.component";

// import { databaseError } from "../test-data/database-error";
// import { databaseStackError } from "../test-data/database-stack-error";
// import { postError } from "../test-data/post-error";
// import { templateError } from "../test-data/template-error";
// import { zeroDivisionError } from "../test-data/zero-division-error";
// import { stringError } from "../test-data/string-error";
// import { cspError } from "../test-data/csp-error";
// import { pageNotFound } from "../test-data/page-not-found";
// import { socialApp } from "../test-data/social-app";

// export default {
//   title: "Events/Event Detail/Entry Request",
//   component: EntryRequestComponent,
//   argTypes: {
//     errorOptions: {
//       options: [
//         "Post Error",
//         "Database Error",
//         "Database Stack Error",
//         "Template Error",
//         "Zero Division Error",
//         "String Error",
//         "CSP Error",
//         "Page Not Found",
//         "SocialApp.DoesNotExist",
//       ],
//       control: { type: "select" },
//     },
//   },
// };

// export const EntryRequest: Story = (args) => {
//   const { errorOptions } = args;
//   let stackError: any = postError.entries[1].data;
//   let error: any = {
//     ...stackError,
//     domainName: "localhost",
//     path: "/database-stack-error/",
//   };
//   let bodyData: any = [
//     [
//       "csrfmiddlewaretoken",
//       "184VTEFb5oyMNrInUlX5Yxj6EuTllb7IiQ9axkeCcqKYrG4PKkXJnn1RrGRdcJ3z",
//     ],
//     ["param1", "val"],
//   ];

//   switch (errorOptions) {
//     case "Database Error":
//       stackError = databaseError.entries[2].data;
//       error = {
//         ...stackError,
//         domainName: "localhost",
//         path: "/database-error/",
//       };
//       bodyData = null;
//       break;
//     case "Database Stack Error":
//       stackError = databaseStackError.entries[2].data;
//       error = {
//         ...stackError,
//         domainName: "localhost",
//         path: "/database-stack-error/",
//       };
//       bodyData = null;
//       break;
//     case "Post Error":
//       stackError = postError.entries[1].data;
//       error = {
//         ...stackError,
//         domainName: "localhost",
//         path: "/database-stack-error/",
//       };
//       bodyData = [
//         [
//           "csrfmiddlewaretoken",
//           "184VTEFb5oyMNrInUlX5Yxj6EuTllb7IiQ9axkeCcqKYrG4PKkXJnn1RrGRdcJ3z",
//         ],
//         ["param1", "val"],
//       ];
//       break;
//     case "Template Error":
//       stackError = templateError.entries[1].data;
//       error = {
//         ...stackError,
//         domainName: "localhost",
//         path: "/template-error/",
//       };
//       bodyData = null;
//       break;
//     case "Zero Division Error":
//       stackError = zeroDivisionError.entries[1].data;
//       error = {
//         ...stackError,
//         domainName: "localhost",
//         path: "/divide-zero/",
//       };
//       bodyData = null;
//       break;
//     case "String Error":
//       stackError = stringError.entries[2].data;
//       error = {
//         ...stackError,
//         domainName: "localhost",
//         path: "/",
//       };
//       bodyData = null;
//       break;
//     case "CSP Error":
//       stackError = cspError.entries[2].data;
//       error = {
//         ...stackError,
//         domainName: "www.website.com",
//         path: "/about-us/our-staff",
//       };
//       bodyData = null;
//       break;
//     case "Page Not Found":
//       stackError = pageNotFound.entries[0].data;
//       error = {
//         ...stackError,
//         domainName: "localhost",
//         path: "/message/",
//       };
//       break;
//     case "SocialApp.DoesNotExist":
//       stackError = socialApp.entries[1].data;
//       error = {
//         ...stackError,
//         domainName: "staging.glitchtip.com",
//         path: "/rest-auth/gitlab/",
//       };
//       bodyData = [
//         [
//           "access_token",
//           "7e6d28e705369c544138248b3bbdc575b5698ec13c21f7e67482c2553a536007",
//         ],
//       ];
//       break;
//   }

//   return {
//     props: {
//       eventEntryRequest$: of(error),
//       requestDataArray$: of(bodyData),
//     },
//   };
// };

export default {};
