import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { MatIconModule } from "@angular/material/icon";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-contexts",
  templateUrl: "./contexts.component.html",
  styleUrls: ["./contexts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule, AsyncPipe],
})
export class ContextsComponent implements OnInit {
  specialContexts$ = this.issueDetailService.specialContexts$;

  constructor(private issueDetailService: IssueDetailService) {}

  ngOnInit() {
    this.issueDetailService.specialContexts$.subscribe();
  }
}
