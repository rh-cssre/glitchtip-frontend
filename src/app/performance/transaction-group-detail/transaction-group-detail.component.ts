import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { combineLatest, EMPTY, Subscription } from "rxjs";
import { exhaustMap, filter, map, tap, take } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { TransactionGroupDetailService } from "./transaction-group-detail.service";
import { HumanizeDurationPipe } from "../../shared/seconds-or-ms.pipe";

@Component({
  selector: "gt-transaction-group-detail",
  templateUrl: "./transaction-group-detail.component.html",
  styleUrls: ["./transaction-group-detail.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    MatIconModule,
    HumanizeDurationPipe,
    DetailHeaderComponent,
  ],
})
export class TransactionGroupDetailComponent implements OnInit, OnDestroy {
  activeOrganizationSlug$ = this.organizationsService.activeOrganizationSlug$;
  organization$ = this.organizationsService.activeOrganization$;
  initialLoadComplete$ =
    this.transactionGroupDetailService.transactionGroupInitialLoadComplete$;
  transactionGroup$ = this.transactionGroupDetailService.transactionGroup$;
  transactionGroupIdParam$ = this.route.paramMap.pipe(
    map((params) => params.get("transaction-group-id"))
  );
  retrieveDetailsSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private transactionGroupDetailService: TransactionGroupDetailService
  ) {}

  ngOnInit() {
    this.retrieveDetailsSubscription = combineLatest([
      this.activeOrganizationSlug$,
      this.transactionGroupIdParam$,
    ])
      .pipe(
        tap(() => this.transactionGroupDetailService.clearState()),
        filter(([orgSlug, groupId]) => !!orgSlug && !!groupId),
        take(1),
        exhaustMap(([orgSlug, groupId]) => {
          if (orgSlug && groupId) {
            return this.transactionGroupDetailService.retrieveTransactionGroup(
              orgSlug,
              parseInt(groupId)
            );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  generateBackLink(projectId: string) {
    return {
      ...this.route.snapshot.queryParams,
      project: projectId,
    };
  }

  ngOnDestroy() {
    this.retrieveDetailsSubscription?.unsubscribe();
  }
}
