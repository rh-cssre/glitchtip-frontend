// import { Story } from "@storybook/angular";
// import { of } from "rxjs";

// import { RawStacktraceComponent } from "./raw-stacktrace.component";

// export default {
//   title: "Events/Event Detail/Raw Stacktrace Title",
//   component: RawStacktraceComponent,
//   argTypes: {
//     hasFunction: {
//       options: [true, false],
//       control: { type: "boolean" },
//     },
//     colNo: {
//       options: [18, 0, null],
//       control: { type: "select" },
//     },
//     hasModule: {
//       options: [true, false],
//       control: { type: "boolean" },
//     },
//     hasLineNo: {
//       options: [true, false],
//       control: { type: "boolean" },
//     },
//     hasPackage: {
//       options: [true, false],
//       control: { type: "boolean" },
//     },
//     hasInstructionAddr: {
//       options: [true, false],
//       control: { type: "boolean" },
//     },
//     hasFileName: {
//       options: [true, false],
//       control: { type: "boolean" },
//     },
//     contextLineNo: {
//       options: [34, 117, null],
//       control: { type: "select" },
//     },
//     eventPlatform: {
//       options: ["javascript", "ruby", "php", "java", "cocoa", "native", ""],
//       control: { type: "select" },
//     },
//   },
//   args: {
//     hasFunction: true,
//     colNo: 18,
//     hasModule: true,
//     hasLineNo: true,
//     hasPackage: true,
//     hasInstructionAddr: true,
//     hasFileName: true,
//     eventPlatform: "java",
//     contextLineNo: 34,
//   },
// };

// export const RawStacktrace: Story = (args) => {
//   const {
//     hasFunction,
//     colNo,
//     hasModule,
//     hasLineNo,
//     hasPackage,
//     hasInstructionAddr,
//     hasFileName,
//     contextLineNo,
//     eventPlatform,
//   } = args;
//   const testValues: any = [
//     {
//       type: "System.DivideByZeroException",
//       value: "Attempted to divide by zero.",
//       module: "System.Runtime.CompilerServices.TaskAwaiter",
//       stacktrace: {
//         frames: [
//           {
//             function: hasFunction ? "inner" : null,
//             colNo,
//             vars: {
//               get_response:
//                 "<bound method BaseHandler._get_response of <django.core.handlers.wsgi.WSGIHandler object at 0x7f9c5109b580>>",
//               request: "<WSGIRequest: GET '/divide-zero/'>",
//               exc: "ZeroDivisionError('division by zero')",
//             },
//             symbol: null,
//             module: hasModule ? "django.core.handlers.exception" : null,
//             lineNo: hasLineNo ? 34 : null,
//             trust: null,
//             errors: null,
//             package: hasPackage
//               ? "/System/Library/Frameworks/UIKit.framework/UIKit"
//               : null,
//             absPath: null,
//             inApp: false,
//             instructionAddr: hasInstructionAddr ? "0x000000019804aa20" : null,
//             filename: hasFileName ? "django/core/handlers/exception.py" : null,
//             platform: null,
//             context: [
//               [33, " try:"],
//               [contextLineNo, " response = get_response(request)"],
//             ],
//             symbolAddr: null,
//           },
//         ],
//       },
//     },
//   ];

//   return {
//     props: {
//       rawStacktraceValues$: of(testValues),
//       eventPlatform,
//     },
//   };
// };

export default {};
