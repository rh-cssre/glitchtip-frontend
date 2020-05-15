import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "app-frame-expanded",
  templateUrl: "./frame-expanded.component.html",
  styleUrls: ["./frame-expanded.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameExpandedComponent {
  @Input() lineNo: string | number | null;
  @Input() context: (string | number)[][];
  @Input() vars: { [key: string]: any } | null;

  checkType(value: any): string {
    if (typeof value === "object" || Array.isArray(value)) {
      return JSON.stringify(value);
    } else {
      return value;
    }
  }
}
