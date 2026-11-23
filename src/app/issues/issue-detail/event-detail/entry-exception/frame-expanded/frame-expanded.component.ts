import { KeyValuePipe } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  input,
} from "@angular/core";
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
  imports: [PrismDirective, MatDividerModule, KeyValuePipe],
})
export class FrameExpandedComponent {
  readonly lineNo = input<string | number | null>();
  readonly context = input<FrameContextTuple[]>();
  @Input() vars?: { [key: string]: Json } | null;
  readonly eventPlatform = input<string>();

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
    const eventPlatform = this.eventPlatform();
    const context = this.context();
    return (
      eventPlatform &&
      context &&
      context[0] &&
      PRISM_ALL_SUPPORTED_GRAMMAR.includes(eventPlatform)
    );
  }

  get firstLineNumber() {
    const context = this.context();
    return context ? context[0][0] : null;
  }

  get highlightLine() {
    const context = this.context();
    const lineNo = this.lineNo();
    if (context && lineNo) {
      return context[0][0] === 0 ? +lineNo + 1 : lineNo;
    }
    return null;
  }

  get codeBlock(): null | string {
    const trailingNewLine = /[\n]$/;

    // TODO: Null tuple values are now replaced with strings on event ingest
    // see: https://gitlab.com/glitchtip/glitchtip-backend/-/merge_requests/887
    // But there will likely still be events in the DB that have null values here.
    // Ternary statement below can be simplified when that is no longer an issue.
    const context = this.context();
    return context?.length
      ? context
          .map((tuple) =>
            tuple[1] ? tuple[1].toString().replace(trailingNewLine, "") : "",
          )
          .join("\r\n")
      : null;
  }
}
