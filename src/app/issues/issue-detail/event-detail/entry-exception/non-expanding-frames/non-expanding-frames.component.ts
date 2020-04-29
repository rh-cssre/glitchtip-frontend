import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Values } from "src/app/issues/interfaces";

@Component({
  selector: "app-non-expanding-frames",
  templateUrl: "./non-expanding-frames.component.html",
  styleUrls: ["./non-expanding-frames.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonExpandingFramesComponent {
  @Input() platform: string | null | undefined;
  @Input() values: Values[];
  @Input() showAllFrames = false;

  getPlatform(
    eventPlatform: string | null | undefined,
    framePlatform: string | null
  ): boolean {
    switch (eventPlatform || framePlatform) {
      case "java":
      case "csharp":
        return true;
      default:
        return false;
    }
  }
}
