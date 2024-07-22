import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, EMPTY, map, tap } from "rxjs";
import { ReleasesAPIService } from "src/app/api/releases/releases-api.service";
import { Release } from "../api/releases/releases.interfaces";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";
import { parseErrorMessage } from "../shared/shared.utils";

export interface ReleasesState extends PaginationStatefulServiceState {
  releases: Release[];
  errors: string[];
}

const initialState: ReleasesState = {
  releases: [],
  pagination: initialPaginationState,
  errors: [],
};

@Injectable({
  providedIn: "root",
})
export class ReleasesService extends PaginationStatefulService<ReleasesState> {
  releases$ = this.getState$.pipe(map((state) => state.releases));
  errors$ = this.getState$.pipe(map((state) => state.errors));

  constructor(private releasesAPIService: ReleasesAPIService) {
    super(initialState);
  }

  getReleases(orgSlug: string, cursor: string | undefined | null) {
    this.retrieveReleases(orgSlug, cursor).subscribe();
  }

  private retrieveReleases(orgSlug: string, cursor: string | undefined | null) {
    this.startPaginatedLoading();
    return this.releasesAPIService.list(orgSlug, cursor).pipe(
      tap((res) => this.setStateAndPagination({ releases: res.body! }, res)),
      catchError((err: HttpErrorResponse) => {
        this.setReleasesError(err);
        return EMPTY;
      })
    );
  }

  private setReleasesError(err: HttpErrorResponse) {
    const state = this.state.getValue();
    this.setState({
      errors: parseErrorMessage(err),
      pagination: {
        ...state.pagination,
        loading: false,
        initialLoadComplete: true,
      },
    });
  }

  startPaginatedLoading() {
    const state = this.state.getValue();
    this.setState({
      errors: [],
      pagination: {
        ...state.pagination,
        loading: true,
        initialLoadComplete: false,
      },
    });
  }
}
