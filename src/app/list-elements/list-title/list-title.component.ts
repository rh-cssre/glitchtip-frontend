import { Component, Input } from "@angular/core";

@Component({
  selector: "gt-list-title",
  templateUrl: "./list-title.component.html",
  styleUrls: ["./list-title.component.scss"],
})
export class ListTitleComponent {
  @Input() searchHits?: string;
  @Input() title?: string;
}
