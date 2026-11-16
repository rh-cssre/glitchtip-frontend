import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { EntryDataComponent } from "../../../../shared/entry-data/entry-data.component";
import { MatDividerModule } from "@angular/material/divider";
import { KeyValuePipe } from "@angular/common";

@Component({
  selector: "gt-entry-message",
  templateUrl: "./entry-message.component.html",
  styleUrls: ["./entry-message.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDividerModule, EntryDataComponent, KeyValuePipe],
})
export class EntryMessageComponent {
  private issueService = inject(IssueDetailService);

  eventEntryMessage = this.issueService.eventEntryMessage;
}
