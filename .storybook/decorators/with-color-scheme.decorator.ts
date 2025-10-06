import { Decorator } from "@storybook/angular";

export const withColorScheme: Decorator = (story, context) => {
  const document = window.parent.document;
  const iframe = document.getElementById(
    "storybook-preview-iframe",
  ) as HTMLIFrameElement;
  const iframeDocument =
    iframe?.contentDocument || iframe?.contentWindow?.document;

  if (iframeDocument) {
    // const root = iframeDocument.documentElement;
    // Add mat 3 dark mode
    // root.setAttribute("style", isDarkMode ? "color-scheme: dark;" : "");
  }

  return story();
};
