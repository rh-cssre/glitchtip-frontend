import { Meta, StoryObj } from "@storybook/angular";

import { FrameTitleComponent } from "./frame-title.component";

type FrameTitleandCustomArgs = FrameTitleComponent & {
  hasFunction: boolean;
  colNo: number | null;
  hasModule: boolean;
  hasLineNo: boolean;
  absPath: string;
  hasFileName: boolean;
  platform: string;
  contextLineNo: number | null;
};

const meta: Meta<FrameTitleandCustomArgs> = {
  title: "Events/Event Detail/Frame Title",
  component: FrameTitleComponent,
  argTypes: {
    hasFunction: {
      options: [true, false],
      control: { type: "boolean" },
    },
    colNo: {
      options: [18, 0, null],
      control: { type: "select" },
    },
    hasModule: {
      options: [true, false],
      control: { type: "boolean" },
    },
    hasLineNo: {
      options: [true, false],
      control: { type: "boolean" },
    },
    absPath: {
      options: [
        "Not Null",
        "Match Filename",
        "MatchModule",
        "Is Url",
        "Malicious Url",
        "Null",
      ],
      control: { type: "select" },
    },
    hasFileName: {
      options: [true, false],
      control: { type: "boolean" },
    },
    platform: {
      options: ["java", "python", "null"],
      control: { type: "select" },
    },
    contextLineNo: {
      options: [34, 117, null],
      control: { type: "select" },
    },
  },
};

export default meta;
type Story = StoryObj<FrameTitleandCustomArgs>;

const absPathOptions: { [index: string]: any } = {
  "Not Null": "/code/errors/views.py",
  "Match Filename": "django/core/handlers/exception.py",
  MatchModule: "django.core.handlers.exception",
  "Is Url": "http://bing.com",
  "Malicious Url": "javascript:alert('attack!')",
  Null: null,
};

export const FrameTitle: Story = {
  name: "Frame Title",
  render: (args) => {
    const {
      hasFunction,
      colNo,
      hasModule,
      hasLineNo,
      absPath,
      hasFileName,
      platform,
      contextLineNo,
    } = args;
    const frameTestData: any = {
      function: hasFunction ? "inner" : null,
      colNo: colNo,
      vars: {
        get_response:
          "<bound method BaseHandler._get_response of <django.core.handlers.wsgi.WSGIHandler object at 0x7f9c5109b580>>",
        request: "<WSGIRequest: GET '/divide-zero/'>",
        exc: "ZeroDivisionError('division by zero')",
      },
      symbol: null,
      module: hasModule ? "django.core.handlers.exception" : null,
      lineNo: hasLineNo ? 34 : null,
      trust: null,
      errors: null,
      package: "1.0.7",
      absPath: absPathOptions[absPath],
      inApp: false,
      instructionAddr:
        "/usr/local/lib/python3.8/site-packages/django/core/handlers/exception.py",
      filename: hasFileName ? "django/core/handlers/exception.py" : null,
      platform: platform === "java" || platform === "python" ? platform : null,
      context: [
        [33, " try:"],
        [contextLineNo, " response = get_response(request)"],
      ],
      symbolAddr: null,
    };
    return {
      props: {
        frame: frameTestData,
      },
    };
  },
  args: {
    hasFunction: true,
    colNo: 18,
    hasModule: true,
    hasLineNo: true,
    absPath: "Match Filename",
    hasFileName: true,
    platform: "java",
    contextLineNo: 34,
  },
};
