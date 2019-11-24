import { Component, OnInit } from "@angular/core";
import { IssuesService } from "../issues.service";
import { Issue } from "../interfaces";

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"]
})
export class IssuesPageComponent implements OnInit {
  issues: Issue[];

  constructor(private issuesService: IssuesService) {}

  ngOnInit() {
    this.issuesService.retrieveIssues().subscribe();
    this.issuesService.getIssues.subscribe(issues => (this.issues = issues));
  }
}
