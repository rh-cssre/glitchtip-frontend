import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";

@Component({
  selector: "app-entry-request",
  templateUrl: "./entry-request.component.html",
  styleUrls: ["./entry-request.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryRequestComponent implements OnInit {
  @Input() culprit: string;

  eventEntryRequest$ = this.issueService.eventEntryRequest$;

  constructor(private issueService: IssueDetailService) {}

  ngOnInit() {}
}
