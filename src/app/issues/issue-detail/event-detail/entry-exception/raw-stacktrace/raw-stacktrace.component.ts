import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Values } from "src/app/issues/interfaces";

@Component({
  selector: "app-raw-stacktrace",
  templateUrl: "./raw-stacktrace.component.html",
  styleUrls: ["./raw-stacktrace.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawStacktraceComponent {
  @Input() eventPlatform: string | null | undefined;
  @Input() values: Values[];

  ljust(str: string, len: number): string {
    return str + Array(Math.max(0, len - str.length) + 1).join(" ");
  }
}
