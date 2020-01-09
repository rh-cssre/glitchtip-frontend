import { Component, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-issue-list-item",
  templateUrl: "./issue-list-item.component.html",
  styleUrls: ["./issue-list-item.component.scss"]
})
export class IssueListItemComponent {
  @Input() title: string;
  @Input() location: string;
  @Input() eventID: number;

  statusOptions = ["unresolved", "resolved", "ignored"];

  form = new FormGroup({
    status: new FormControl("")
  });

  onSubmit() {
    console.log("submit");
  }
}
