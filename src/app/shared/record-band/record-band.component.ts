import { ChangeDetectionStrategy, Component } from "@angular/core";

/** The tinted band a data record page opens with: identity, key figures, summary, tabs. */
@Component({
  selector: "gt-record-band",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./record-band.component.html",
  styleUrl: "./record-band.component.scss",
})
export class RecordBandComponent {}
