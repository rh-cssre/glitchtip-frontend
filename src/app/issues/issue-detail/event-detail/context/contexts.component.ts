import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";

@Component({
  selector: "app-contexts",
  templateUrl: "./contexts.component.html",
  styleUrls: ["./contexts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextsComponent implements OnInit {
  specialContexts$ = this.issueDetailService.specialContexts$;

  constructor(private issueDetailService: IssueDetailService) {}

  ngOnInit() {
    this.issueDetailService.specialContexts$.subscribe();
  }
}
