import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";

@Component({
  selector: "app-entry-exception",
  templateUrl: "./entry-exception.component.html",
  styleUrls: ["./entry-exception.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryExceptionComponent {
  @Input() eventTitle: string | undefined;
  @Input() platform: string | null | undefined;
  eventEntryException$ = this.issueService.eventEntryException$;
  isReversed$ = this.issueService.isReversed$;

  constructor(private issueService: IssueDetailService) {}

  getFlippedFrames() {
    this.issueService.getReversedFrames();
  }

  getPlatform(
    eventPlatform: string | null | undefined,
    framePlatform: string | null
  ): boolean {
    switch (eventPlatform || framePlatform) {
      case "java":
      case "csharp":
        return true;
      default:
        return false;
    }
  }
}
