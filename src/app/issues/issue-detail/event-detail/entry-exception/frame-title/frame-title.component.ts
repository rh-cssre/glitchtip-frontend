import {
  Component,
  ChangeDetectionStrategy,
  Input,
  input,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import type { Frame } from "src/app/issues/interfaces";
import {
  cleanIosPath,
  isIosPlatform,
  isSwiftNameMangled,
} from "src/app/issues/utils";

@Component({
  selector: "gt-frame-title",
  templateUrl: "./frame-title.component.html",
  styleUrl: "./frame-title.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltipModule, MatButtonModule, MatIconModule],
})
export class FrameTitleComponent {
  @Input() frame: Frame | undefined;
  readonly eventPlatform = input<string | null>();

  private resolvePlatform(framePlatform: string | null): string | null {
    return this.eventPlatform() || framePlatform;
  }

  /** Show a tool tip with the absPath if it doesn't match filename or module */
  showToolTip(
    absPath: string | null,
    filename: string | null,
    module: string | null,
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
    module: string | null,
  ): string | undefined {
    const effectivePlatform = this.resolvePlatform(platform);
    let displayValue: string | undefined;

    switch (effectivePlatform) {
      case "java":
      case "csharp":
        displayValue = module ? module : filename ? filename : undefined;
        break;
      default:
        displayValue = filename ? filename : module ? module : undefined;
    }

    if (displayValue && isIosPlatform(effectivePlatform)) {
      displayValue = cleanIosPath(displayValue);
    }

    return displayValue;
  }

  isUrl(str: string | null): boolean {
    if (str) {
      return /^https?:/.test(str);
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

  cleanPackagePath(packagePath: string, framePlatform: string | null): string {
    return isIosPlatform(this.resolvePlatform(framePlatform))
      ? cleanIosPath(packagePath)
      : packagePath;
  }

  isMangledSwiftName(
    functionName: string | null,
    framePlatform: string | null,
  ): boolean {
    return isSwiftNameMangled(functionName, this.resolvePlatform(framePlatform));
  }
}
