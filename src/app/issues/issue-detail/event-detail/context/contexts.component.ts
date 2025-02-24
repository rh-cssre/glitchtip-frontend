import { Component, OnInit, ChangeDetectionStrategy, inject } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { MatIconModule } from "@angular/material/icon";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-contexts",
  templateUrl: "./contexts.component.html",
  styleUrls: ["./contexts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, AsyncPipe],
})
export class ContextsComponent implements OnInit {
  private issueDetailService = inject(IssueDetailService);

  specialContexts$ = this.issueDetailService.specialContexts$;

  ngOnInit() {
    this.issueDetailService.specialContexts$.subscribe();
  }
}
