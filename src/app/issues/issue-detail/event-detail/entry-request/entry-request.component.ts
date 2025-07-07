import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { EntryDataComponent } from "../../../../shared/entry-data/entry-data.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { KeyValuePipe } from "@angular/common";

@Component({
  selector: "gt-entry-request",
  templateUrl: "./entry-request.component.html",
  styleUrls: ["./entry-request.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDividerModule,
    MatTooltipModule,
    EntryDataComponent,
    KeyValuePipe,
  ],
})
export class EntryRequestComponent {
  private issueService = inject(IssueDetailService);

  eventEntryRequest = this.issueService.eventEntryRequest;
}
