import { HttpResponse } from "@angular/common/http";
import { map } from "rxjs/operators";
import { StatefulService } from "./stateful-service";

/**
 * Pagination info exists in a header, this parses it out for storing.
 */
const processLinkHeader = (linkHeader: string) =>
  linkHeader.split(",").reduce<{ [key: string]: string }>((acc, link) => {
    // Only return results url when results are present
    const match = link.match(/<(.*)>; rel="(\w*)"/);
    const results = link
      .split("; ")
      .find((x) => x.startsWith("results"))
      ?.includes("true");
    if (results && match) {
      const url = match[1];
      const rel = match[2];
      acc[rel] = url;
      return acc;
    }
    return acc;
  }, {});

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
  initialLoadComplete$ = this.pagination$.pipe(
    map((pagination) => pagination.initialLoadComplete)
  );
  loading$ = this.pagination$.pipe(map((pagination) => pagination.loading));
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

/**
 * Component level interface for paging needs
 */
export interface Paginator extends PaginationState {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPageParams: {
    [key: string]: string;
  } | null;
  previousPageParams: {
    [key: string]: string;
  } | null;
  /** Human readable object count string that appends "+" to indicate max hits */
  count: string | undefined;
}
