import { Component, ChangeDetectionStrategy, input } from "@angular/core";

@Component({
  standalone: true,
  selector: "gt-entry-data",
  templateUrl: "./entry-data.component.html",
  styleUrls: ["./entry-data.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDataComponent {
  readonly key = input<any>();
  readonly value = input<any>();

  get displayValue() {
    const value = this.value();
    return typeof value === "object" ? JSON.stringify(value) : value;
  }
}
