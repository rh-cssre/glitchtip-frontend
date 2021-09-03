import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { JsonArrayOrObject, Json } from "src/app/interface-primitives";

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

  checkType(value: JsonArrayOrObject | Json): string {
    if (value === null) {
      return "";
    } else if (typeof value !== "string" || Array.isArray(value)) {
      return JSON.stringify(value);
    } else {
      return value;
    }
  }
}
