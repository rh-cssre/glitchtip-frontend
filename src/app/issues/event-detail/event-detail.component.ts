import { Component, Input } from "@angular/core";

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.scss"]
})
export class EventDetailComponent {
  @Input() eventId: string;
}
