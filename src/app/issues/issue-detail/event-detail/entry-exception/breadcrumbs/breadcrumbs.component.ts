import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Json } from "src/app/interface-primitives";
import { IssueDetailService } from "../../../issue-detail.service";
import { BreadcrumbHttp } from "src/app/issues/interfaces";
import { map } from "rxjs/operators";
import { KeyValue } from "@angular/common";

@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  breadcrumbs$ = this.issueDetailService.breadcrumbsExpanded$;
  isExpanded$ = this.issueDetailService.areBreadcrumbsExpanded;
  showExpandButton$ = this.issueDetailService.breadcrumbs$.pipe(
    map((data) => (data && data?.values.length > 5 ? true : false))
  );

  constructor(private issueDetailService: IssueDetailService) {}

  isBreadcrumbHttp(
    data: { [key: string]: Json } | BreadcrumbHttp | null
  ): data is BreadcrumbHttp {
    return (data as BreadcrumbHttp).url !== undefined;
  }

  checkForJsonType(
    data: { [key: string]: Json } | BreadcrumbHttp | null
  ): data is { [key: string]: Json } {
    return (data as { [key: string]: Json }) !== undefined;
  }

  toggleIsExpanded() {
    this.issueDetailService.getToggleAreBreadcrumbsExpanded();
  }

  keepOrder = (
    a: KeyValue<string, Json>,
    b: KeyValue<string, Json>
  ): number => {
    return 0;
  };
}
