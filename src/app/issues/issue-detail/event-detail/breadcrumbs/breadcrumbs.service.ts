import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { BreadcrumbValueData, EventDetail } from "src/app/issues/interfaces";
import { IssueDetailService } from "../../issue-detail.service";

interface BreadcrumbsState {
  isExpanded: boolean;
}

const initialState: BreadcrumbsState = {
  isExpanded: false,
};

@Injectable({
  providedIn: "root",
})
export class BreadcrumbsService {
  private readonly state = new BehaviorSubject<BreadcrumbsState>(initialState);
  private readonly getState$ = this.state.asObservable();

  readonly isExpanded = this.getState$.pipe(map((state) => state.isExpanded));
  readonly breadcrumbs$ = this.issueDetailService.event$.pipe(
    map((event) => (event ? this.eventEntryBreadcrumbs(event) : undefined))
  );

  constructor(private issueDetailService: IssueDetailService) {
    this.breadcrumbs$
      .pipe(
        map((breadcrumbs) => {
          if (breadcrumbs) {
            breadcrumbs?.values.length <= 5
              ? this.setIsExpanded(true)
              : this.setIsExpanded(false);
          }
        })
      )
      .subscribe();
  }

  toggleExpand() {
    this.setToggleExpand();
  }

  /* Return the breadcrumbs entry type for an event */
  private eventEntryBreadcrumbs(
    event: EventDetail
  ): BreadcrumbValueData | undefined {
    const breadcrumbs = this.getBreadcrumbs(event);

    if (breadcrumbs) {
      if (breadcrumbs.values.length > 5) {
        this.setIsExpanded(false);
        const squashedCrumbs = [...breadcrumbs.values.slice(0, 10)];
        return {
          ...breadcrumbs,
          values: squashedCrumbs,
        };
      } else {
        this.setIsExpanded(true);
        return { ...breadcrumbs };
      }
    }
    return;
  }

  getBreadcrumbs(event: EventDetail) {
    return this.issueDetailService.getEntryData(event, "breadcrumbs") as
      | BreadcrumbValueData
      | undefined;
  }

  private setIsExpanded(expand: boolean) {
    this.state.next({
      ...this.state.getValue(),
      isExpanded: expand,
    });
  }

  private setToggleExpand() {
    const crumbsAreExpanded = this.state.getValue().isExpanded;
    this.state.next({
      ...this.state.getValue(),
      isExpanded: !crumbsAreExpanded,
    });
  }
}
