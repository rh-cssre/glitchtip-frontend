import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter, map, Observable, withLatestFrom } from "rxjs";
import { urlParamsToObject } from "src/app/issues/utils";
import {
  PaginationStatefulService,
  PaginationStatefulServiceState,
  Paginator,
} from "./pagination-stateful-service";

export abstract class PaginationBaseComponent<
  TState extends PaginationStatefulServiceState,
  TService extends PaginationStatefulService<TState>
> {
  paginator$: Observable<Paginator>;
  /** Emits cursor only at router navigation end (to avoid duplicates) */
  cursorNavigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    withLatestFrom(this.route.queryParams),
    map(([_, queryParams]) => queryParams.cursor as string | undefined)
  );

  constructor(
    protected service: TService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
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
