import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/** The tinted band a data record page opens with: identity, key figures, summary, tabs. */
@Component({
  selector: "gt-record-band",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./record-band.component.html",
  styleUrl: "./record-band.component.scss",
  host: {
    "[class.gt-record-band--strip]": "summary() === 'strip'",
  },
})
export class RecordBandComponent {
  /** A text summary sits on a darker strip; a graphic one under a hairline. */
  readonly summary = input<"line" | "strip">("line");
}
