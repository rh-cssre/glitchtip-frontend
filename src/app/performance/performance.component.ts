import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { Subscription } from "rxjs";
import { distinctUntilChanged, filter } from "rxjs/operators";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { PaginationBaseComponent } from "../shared/stateful-service/pagination-stateful-service";
import { PerformanceState, PerformanceService } from "./performance.service";

@Component({
  selector: "app-performance",
  templateUrl: "./performance.component.html",
  styleUrls: ["./performance.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceComponent
  extends PaginationBaseComponent<PerformanceState, PerformanceService>
  implements OnInit, OnDestroy {
  sub: Subscription | null = null;
  transactions$ = this.service.transactionsWithDelta$;

  countMapping: { [k: string]: string } = {
    "=1": "Transaction",
    other: "Transactions",
  };

  constructor(
    protected service: PerformanceService,
    private organizationsService: OrganizationsService
  ) {
    super(service);
  }

  ngOnInit() {
    this.sub = this.organizationsService.activeOrganizationSlug$
      .pipe(
        filter((slug) => !!slug),
        distinctUntilChanged()
      )
      .subscribe((slug) => {
        this.service.getTransactions(slug!);
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.service.clearState();
  }
}
