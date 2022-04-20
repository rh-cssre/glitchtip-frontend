import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, EMPTY } from "rxjs";
import { exhaustMap, map, tap } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { TransactionGroupDetailService } from "./transaction-group-detail.service";

@Component({
  selector: "gt-transaction-group-detail",
  templateUrl: "./transaction-group-detail.component.html",
  styleUrls: ["./transaction-group-detail.component.scss"],
})
export class TransactionGroupDetailComponent implements OnInit {
  activeOrganizationSlug$ = this.organizationsService.activeOrganizationSlug$
  organization$ = this.organizationsService.activeOrganization$;
  initialLoadComplete$ = this.transactionGroupDetailService.transactionGroupInitialLoadComplete$
  transactionGroup$ = this.transactionGroupDetailService.transactionGroup$
  transactionGroupIdParam$ = this.route.paramMap.pipe(
    map((params) => params.get("transaction-group-id"))
  );

  constructor(
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private transactionGroupDetailService: TransactionGroupDetailService
  ) {}

  ngOnInit() {
    combineLatest([
      this.activeOrganizationSlug$,
      this.transactionGroupIdParam$
    ])
      .pipe(
        tap(() => this.transactionGroupDetailService.clearState()),
        exhaustMap(([orgSlug, groupId]) => {
          if (orgSlug && groupId) {
            return this.transactionGroupDetailService.retrieveTransactionGroup(
              orgSlug, parseInt(groupId)
            );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }
}
