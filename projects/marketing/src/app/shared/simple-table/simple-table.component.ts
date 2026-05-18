import { Component, input } from "@angular/core";

@Component({
  selector: "mkt-simple-table",
  templateUrl: "./simple-table.component.html",
  styleUrls: ["./simple-table.component.scss"],
})
export class SimpleTableComponent {
  readonly columns = input.required<string[]>();
  readonly rows = input.required<string[][]>();
}
