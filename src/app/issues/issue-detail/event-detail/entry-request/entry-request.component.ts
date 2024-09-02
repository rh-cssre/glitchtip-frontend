import { Component, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { EntryDataComponent } from "../../../../shared/entry-data/entry-data.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { AsyncPipe, KeyValuePipe } from "@angular/common";

@Component({
  selector: "gt-entry-request",
  templateUrl: "./entry-request.component.html",
  styleUrls: ["./entry-request.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDividerModule,
    MatTooltipModule,
    EntryDataComponent,
    AsyncPipe,
    KeyValuePipe
],
})
export class EntryRequestComponent {
  eventEntryRequest$ = this.issueService.eventEntryRequest$;

  constructor(private issueService: IssueDetailService) {}
}
