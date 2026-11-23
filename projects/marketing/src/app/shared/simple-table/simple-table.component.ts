import { Component, input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "mkt-simple-table",
  templateUrl: "./simple-table.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./simple-table.component.scss"],
})
export class SimpleTableComponent {
  readonly columns = input.required<string[]>();
  readonly rows = input.required<string[][]>();
}
