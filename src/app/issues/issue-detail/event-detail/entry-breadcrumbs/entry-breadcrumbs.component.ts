import { KeyValue } from "@angular/common";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Json } from "src/app/interface-primitives";
import { IssueDetailService } from "../../issue-detail.service";

@Component({
  selector: "app-entry-breadcrumbs",
  templateUrl: "./entry-breadcrumbs.component.html",
  styleUrls: ["./entry-breadcrumbs.component.scss"],
})
export class EntryBreadcrumbsComponent implements AfterViewInit {
  @ViewChild("breadBox") breadBox?: ElementRef;

  breadcrumbs$ = this.issueDetailService.breadcrumbs$;

  showShowMore = false;

  constructor(private issueDetailService: IssueDetailService) {}

  ngAfterViewInit() {
    /** height should match .bread-box scss class */
    this.breadBox?.nativeElement.offsetHeight >= 1250
      ? (this.showShowMore = true)
      : (this.showShowMore = false);
  }

  expandBreadcrumbs() {
    this.showShowMore = false;
  }

  keepOrder = (
    a: KeyValue<string, Json>,
    b: KeyValue<string, Json>
  ): number => {
    return 0;
  };
}
