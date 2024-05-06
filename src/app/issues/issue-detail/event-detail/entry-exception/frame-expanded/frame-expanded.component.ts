import { NgIf, NgFor, KeyValuePipe } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { JsonArrayOrObject, Json } from "src/app/interface-primitives";
import { FrameContextTuple } from "src/app/issues/interfaces";
import { PRISM_ALL_SUPPORTED_GRAMMAR } from "src/app/prismjs/constants";
import { PrismDirective } from "src/app/prismjs/prism.directive";

@Component({
  selector: "gt-frame-expanded",
  templateUrl: "./frame-expanded.component.html",
  styleUrls: ["./frame-expanded.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, PrismDirective, NgFor, MatDividerModule, KeyValuePipe],
})
export class FrameExpandedComponent {
  @Input() lineNo?: string | number | null;
  @Input() context?: FrameContextTuple[];
  @Input() vars?: { [key: string]: Json } | null;
  @Input() eventPlatform?: string;

  checkType(value: JsonArrayOrObject | Json): string {
    if (value === null) {
      return "";
    } else if (typeof value !== "string" || Array.isArray(value)) {
      return JSON.stringify(value);
    } else {
      return value;
    }
  }

  get shouldDisplayPrismCode() {
    return (
      this.eventPlatform &&
      this.context &&
      this.context[0] &&
      PRISM_ALL_SUPPORTED_GRAMMAR.includes(this.eventPlatform)
    );
  }

  get firstLineNumber() {
    return this.context ? this.context[0][0] : null;
  }

  get highlightLine() {
    if (this.context && this.lineNo) {
      return this.context[0][0] === 0 ? +this.lineNo + 1 : this.lineNo;
    }
    return null;
  }

  get codeBlock(): null | string {
    const trailingNewLine = /[\n]$/;

    return this.context?.length
      ? this.context
          .map((tuple) => tuple[1].toString().replace(trailingNewLine, ""))
          .join("\r\n")
      : null;
  }
}
