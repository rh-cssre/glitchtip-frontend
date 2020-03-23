import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { map, filter } from "rxjs/operators";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";

@Component({
  selector: "app-subscription",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionComponent implements OnDestroy {
  subscription$ = this.service.subscription$;
  routerSubscription: Subscription;

  constructor(
    private service: SubscriptionsService,
    private route: ActivatedRoute
  ) {
    this.routerSubscription = this.route.params
      .pipe(
        map(params => params["org-slug"] as string),
        filter(slug => !!slug)
      )
      .subscribe(slug => {
        this.service.retrieveSubscription(slug).toPromise();
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.service.clearState();
  }
}
