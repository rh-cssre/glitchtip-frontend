import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "gt-contexts",
  templateUrl: "./contexts.component.html",
  styleUrls: ["./contexts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
})
export class ContextsComponent {
  private issueDetailService = inject(IssueDetailService);

  specialContexts = this.issueDetailService.specialContexts;
}
