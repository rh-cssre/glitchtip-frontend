import { Component, Input } from "@angular/core";

@Component({
  selector: "gt-list-title",
  templateUrl: "./list-title.component.html",
})
export class ListTitleComponent {
  @Input() searchHits?: string;
  @Input() title?: string;
}
