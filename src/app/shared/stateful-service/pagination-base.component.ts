import { Router, NavigationEnd, ActivatedRoute, Params } from "@angular/router";
import { filter, map, Observable, takeUntil, withLatestFrom } from "rxjs";
import { urlParamsToObject } from "src/app/issues/utils";
import {
  PaginationStatefulService,
  PaginationStatefulServiceState,
  Paginator,
} from "./pagination-stateful-service";
import { StatefulBaseComponent } from "./stateful-base.component";

/**
 * Extension of StatefulBaseComponent that assumes exactly one paginated state element.
 * Assists in manipulating pagination (go to next page) and fetching info such as count
 */
export abstract class PaginationBaseComponent<
  TState extends PaginationStatefulServiceState,
  TService extends PaginationStatefulService<TState>
> extends StatefulBaseComponent<TState, TService> {
  /** Observable of relevant pagination concepts such as cursor and count */
  paginator$: Observable<Paginator>;
  /** Emits cursor only at router navigation end (to avoid duplicates) */
  cursorNavigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    withLatestFrom(this.route.queryParams),
    map(([_, queryParams]) => queryParams.cursor as string | undefined)
  );
  /** Route URL params, queryParams, taken until component destroy$ */
  activeCombinedParams$ = this.cursorNavigationEnd$.pipe(
    takeUntil(this.destroy$),
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([_, params, queryParams]) => [params, queryParams] as [Params, Params])
  );

  constructor(
    protected service: TService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(service);
    this.paginator$ = service.pagination$.pipe(
      map((pagination) => ({
        ...pagination,
        hasNextPage: !!pagination.nextPageURL,
        hasPreviousPage: !!pagination.previousPageURL,
        nextPageParams: urlParamsToObject(pagination.nextPageURL),
        previousPageParams: urlParamsToObject(pagination.previousPageURL),
        count:
          pagination.hits && pagination.hits === pagination.maxHits
            ? pagination.hits.toString() + "+"
            : pagination.hits?.toString(),
      }))
    );
  }
}
