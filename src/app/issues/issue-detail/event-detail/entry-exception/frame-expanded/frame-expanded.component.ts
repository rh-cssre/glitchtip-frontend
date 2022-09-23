import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { JsonArrayOrObject, Json } from "src/app/interface-primitives";
import { PRISM_ALL_SUPPORTED_GRAMMER } from "src/app/prismjs/constants";

@Component({
  selector: "gt-frame-expanded",
  templateUrl: "./frame-expanded.component.html",
  styleUrls: ["./frame-expanded.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameExpandedComponent {
  @Input() lineNo?: string | number | null;
  @Input() context?: (string | number)[][];
  @Input() vars?: { [key: string]: Json } | null;
  @Input() eventPlatform?: string;
  firstLineNumber?: number;

  checkType(value: JsonArrayOrObject | Json): string {
    if (value === null) {
      return "";
    } else if (typeof value !== "string" || Array.isArray(value)) {
      return JSON.stringify(value);
    } else {
      return value;
    }
  }

  getCodeBlock(): null | string {
    if (
      this.eventPlatform &&
      this.context &&
      this.context[0] &&
      PRISM_ALL_SUPPORTED_GRAMMER.includes(this.eventPlatform)
    ) {
      const firstNumber = this.context[0][0];
      if (typeof firstNumber == "number") {
        this.firstLineNumber = firstNumber;
        return this.context.map((tuple) => tuple[1]).join("\r\n");
      }
    }
    return null;
  }
}
