import { Component, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { EntryDataComponent } from "../../../../shared/entry-data/entry-data.component";
import { MatDividerModule } from "@angular/material/divider";
import { AsyncPipe, KeyValuePipe } from "@angular/common";

@Component({
  selector: "gt-entry-message",
  templateUrl: "./entry-message.component.html",
  styleUrls: ["./entry-message.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDividerModule,
    EntryDataComponent,
    AsyncPipe,
    KeyValuePipe
],
})
export class EntryMessageComponent {
  eventEntryMessage$ = this.issueService.eventEntryMessage$;

  constructor(private issueService: IssueDetailService) {}
}
