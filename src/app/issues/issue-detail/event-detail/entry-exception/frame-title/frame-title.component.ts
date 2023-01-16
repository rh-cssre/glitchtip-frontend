import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import type { Frame } from "src/app/issues/interfaces";

@Component({
  selector: "gt-frame-title",
  templateUrl: "./frame-title.component.html",
  styleUrls: ["./frame-title.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameTitleComponent {
  @Input() frame: Frame | undefined;
  @Input() eventPlatform: string | null | undefined;

  /** Show a tool tip with the absPath if it doesn't match filename or module */
  showToolTip(
    absPath: string | null,
    filename: string | null,
    module: string | null
  ): string {
    if ((absPath && absPath !== filename) || (absPath && absPath !== module)) {
      return absPath;
    } else {
      return "";
    }
  }

  // tslint:disable-next-line: max-line-length
  // Credit: Sentry https://gitlab.com/glitchtip/sentry-open-source/sentry/-/blob/master/src/sentry/static/sentry/app/components/events/interfaces/frame.jsx#L136
  displayFilenameOrModule(
    platform: string | null,
    filename: string | null,
    module: string | null
  ): string | undefined {
    switch (this.eventPlatform || platform) {
      case "java":
      case "csharp":
        return module ? module : filename ? filename : undefined;
      default:
        return filename ? filename : module ? module : undefined;
    }
  }

  isUrl(str: string | null): boolean {
    if (str) {
      return str.startsWith("http") ? true : false;
    } else {
      return false;
    }
  }

  sanitizeUrl(url: string): string | null {
    if (url === "about:blank") {
      return null;
    }
    return url;
  }
}
