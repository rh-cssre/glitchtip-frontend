import { HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { processLinkHeader } from "../utils-pagination";
import { StatefulService } from "./stateful-service";

export interface PaginationState {
  hits: number | null;
  maxHits: number | null;
  page: number | null;
  nextPageURL: string | null;
  previousPageURL: string | null;
  loading: boolean;
  initialLoadComplete: boolean;
}

export const initialPaginationState: PaginationState = {
  hits: null,
  maxHits: null,
  page: null,
  nextPageURL: null,
  previousPageURL: null,
  loading: false,
  initialLoadComplete: false,
};

export interface PaginationStatefulServiceState {
  pagination: PaginationState;
}

/**
 * Extends StatefulService to include some basic CRUD pagination state and logic
 * If working with a CRUD view that is paginated, use this as the base class
 */
export abstract class PaginationStatefulService<
  TState extends PaginationStatefulServiceState
> extends StatefulService<TState> {
  pagination$ = this.getState$.pipe(map((state) => state.pagination));
  constructor(initialState: TState) {
    super(initialState);
  }

  setStateAndPagination(newState: Partial<TState>, res: HttpResponse<unknown>) {
    const prevState = this.state.getValue();

    const link = res.headers.get("link");
    const results = link ? processLinkHeader(link) : {};
    const pagination = {
      ...prevState.pagination,
      nextPageURL: results.next,
      previousPageURL: results.previous,
      hits: res.headers.get("x-hits"),
      maxHits: res.headers.get("x-max-hits"),
      loading: false,
      initialLoadComplete: true,
    };
    this.state.next({
      ...prevState,
      pagination,
      ...newState,
    });
  }
}

export abstract class PaginationBaseComponent<
  TState extends PaginationStatefulServiceState,
  TService extends PaginationStatefulService<TState>
> {
  nextPageURL$: Observable<string | null>;
  previousPageURL$: Observable<string | null>;
  hits$: Observable<number | null>;

  constructor(protected service: TService) {
    this.nextPageURL$ = service.pagination$.pipe(
      map((pagination) => pagination.nextPageURL)
    );
    this.previousPageURL$ = service.pagination$.pipe(
      map((pagination) => pagination.previousPageURL)
    );
    this.hits$ = service.pagination$.pipe(map((pagination) => pagination.hits));
  }
}
