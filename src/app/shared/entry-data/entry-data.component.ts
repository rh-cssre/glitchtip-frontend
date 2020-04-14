import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "app-entry-data",
  templateUrl: "./entry-data.component.html",
  styleUrls: ["./entry-data.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDataComponent {
  @Input() key: string;
  @Input() value: string | number | undefined;
}
