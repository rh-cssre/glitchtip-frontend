import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IssueDetailService } from "../issue-detail.service";
import { exhaustMap, map } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { NgStyle, AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-issue-detail-tags",
  templateUrl: "./issue-detail-tags.component.html",
  styleUrls: ["./issue-detail-tags.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, NgStyle, MatTooltipModule, AsyncPipe],
})
export class IssueDetailTagsComponent implements OnInit {
  tags$ = this.issueService.tags$;

  issueIdParam$ = this.route.paramMap.pipe(
    map((params) => params.get("issue-id"))
  );
  percent = 10;

  constructor(
    private issueService: IssueDetailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.issueIdParam$
      .pipe(
        exhaustMap((issueId) => {
          if (issueId) {
            return this.issueService.retrieveTags(+issueId);
          }
          return EMPTY;
        })
      )
      .subscribe();
  }
}
