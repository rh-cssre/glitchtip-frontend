import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, withLatestFrom } from "rxjs";
import { map, tap } from "rxjs/operators";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { CommentsState, CommentsService } from "./comments.service";

@Component({
  selector: "gt-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent
  extends PaginationBaseComponent<CommentsState, CommentsService>
  implements OnDestroy
{
  comments$ = this.commentsService.comments$;
  loading$ = this.commentsService.loading$;
  errorReports$ = this.commentsService.error$;

  navigationEnd$ = this.cursorNavigationEnd$.pipe(
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([_, params, queryParams]) => {
      const issueId: number | undefined = params["issue-id"];
      const cursor: string | undefined = queryParams.cursor;
      return { issueId, cursor };
    })
  );

  routerEventSubscription: Subscription;

  constructor(
    private commentsService: CommentsService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(commentsService, router, route);
    this.routerEventSubscription = this.navigationEnd$
      .pipe(
        tap(({ issueId, cursor }) => {
          if (issueId) {
            this.commentsService.getComments(issueId, cursor);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
  }
}
