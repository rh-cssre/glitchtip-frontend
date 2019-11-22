import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-issue-list-item",
  templateUrl: "./issue-list-item.component.html",
  styleUrls: ["./issue-list-item.component.scss"]
})
export class IssueListItemComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() eventId: number;
}
