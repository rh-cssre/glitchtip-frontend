import { Component, Input } from "@angular/core";

@Component({
  selector: "gt-event-info",
  templateUrl: "./event-info.component.html",
  styleUrls: ["./event-info.component.scss"],
})

export class EventInfoComponent {
  @Input() dialog = false;
}
