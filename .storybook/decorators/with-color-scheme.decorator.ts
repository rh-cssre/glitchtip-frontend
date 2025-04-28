import { Decorator } from "@storybook/angular";
import { useDarkMode } from "storybook-dark-mode";

export const withColorScheme: Decorator = (story, context) => {
  const isDarkMode = useDarkMode();

  const document = window.parent.document;
  const iframe = document.getElementById(
    "storybook-preview-iframe"
  ) as HTMLIFrameElement;
  const iframeDocument =
    iframe?.contentDocument || iframe?.contentWindow?.document;

  if (iframeDocument) {
    const root = iframeDocument.documentElement;
    // Add mat 3 dark mode
    root.setAttribute("style", isDarkMode ? "color-scheme: dark;" : "");
    // mat 2, remove when upgrading to mat 3
    if (isDarkMode) {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }

  return story();
};
