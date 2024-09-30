import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  standalone: true,
  selector: "gt-entry-data",
  templateUrl: "./entry-data.component.html",
  styleUrls: ["./entry-data.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDataComponent {
  @Input() key?: string;
  @Input() value: unknown;

  get displayValue() {
    return typeof this.value === "object"
      ? JSON.stringify(this.value)
      : this.value;
  }
}
