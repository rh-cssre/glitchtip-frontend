// import { Story } from "@storybook/angular";
// import { of } from "rxjs";

// import { EntryExceptionComponent } from "./entry-exception.component";
// import { databaseError } from "../test-data/database-error";
// import { databaseStackError } from "../test-data/database-stack-error";
// import { postError } from "../test-data/post-error";
// import { templateError } from "../test-data/template-error";
// import { zeroDivisionError } from "../test-data/zero-division-error";
// import { stringError } from "../test-data/string-error";
// import { socialApp } from "../test-data/social-app";
// import { zeroDivisionDotnet } from "../test-data/zero-division-dotnet";
// import { stacktraceUndefined } from "../test-data/stacktrace-undefined";

// export default {
//   title: "Events/Event Detail/Entry Exception",
//   component: EntryExceptionComponent,
//   argTypes: {
//     errorType: {
//       options: [
//         "Database Error",
//         "Database Stack Error",
//         "Post Error",
//         "Template Error",
//         "Zero Division Error",
//         "Zero Division Dotnet",
//         "String Error",
//         "SocialApp.DoesNotExist",
//         "Test with Undefined Stacktrace",
//       ],
//       control: { type: "select" },
//     },
//   },
// };

// export const EntryException: Story = (args) => {
//   const { errorType } = args;
//   let error: any = databaseError.entries[0].data;
//   let title: string = databaseError.title;
//   let platform: string = databaseError.platform;

//   switch (errorType) {
//     case "Database Error":
//       error = databaseError.entries[0].data;
//       title = databaseError.title;
//       platform = databaseError.platform;
//       break;
//     case "Database Stack Error":
//       error = databaseStackError.entries[0].data;
//       title = databaseStackError.title;
//       platform = databaseStackError.platform;
//       break;
//     case "Post Error":
//       error = postError.entries[0].data;
//       title = postError.title;
//       platform = postError.platform;
//       break;
//     case "Template Error":
//       error = templateError.entries[0].data;
//       title = templateError.title;
//       platform = templateError.platform;
//       break;
//     case "Zero Division Error":
//       error = zeroDivisionError.entries[0].data;
//       title = zeroDivisionError.title;
//       platform = zeroDivisionError.platform;
//       break;
//     case "Zero Division Dotnet":
//       error = zeroDivisionDotnet.entries[1].data;
//       title = zeroDivisionDotnet.title;
//       platform = zeroDivisionDotnet.platform;
//       break;
//     case "String Error":
//       error = stringError.entries[0].data;
//       title = stringError.title;
//       platform = stringError.platform;
//       break;
//     case "SocialApp.DoesNotExist":
//       error = socialApp.entries[0].data;
//       title = socialApp.title;
//       platform = socialApp.platform;
//       break;
//     case "Test with Undefined Stacktrace":
//       error = stacktraceUndefined.entries[0].data;
//       title = stacktraceUndefined.title;
//       platform = databaseError.platform;
//       break;
//   }
//   return {
//     props: {
//       eventEntryException$: of(error),
//       eventTitle: title,
//       eventPlatform: platform,
//     },
//   };
// };

export default {};
