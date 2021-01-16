import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Observable, Subscription } from "rxjs";
import { distinctUntilChanged, filter, map, mergeMap } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { Transaction } from "src/app/api/transactions/transactions.interfaces";
import { TransactionsService } from "src/app/api/transactions/transactions.service";

@Component({
  templateUrl: "./transaction-detail.component.html",
  styleUrls: ["./transaction-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDetailComponent implements OnInit, OnDestroy {
  sub: Subscription | null = null;
  transaction$: Observable<Transaction> | null = null;
  constructor(
    private transactionsService: TransactionsService,
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService
  ) {}

  ngOnInit() {
    this.transaction$ = combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.route.paramMap,
    ]).pipe(
      map(([slug, params]) => [slug, params.get("event-id")]),
      filter(([slug, eventId]) => !!slug && !!eventId),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      mergeMap(([slug, eventId]) =>
        this.transactionsService.retrieve(slug!, eventId!)
      )
    );
    this.sub = this.transaction$.subscribe();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.transaction$ = null;
  }
}
