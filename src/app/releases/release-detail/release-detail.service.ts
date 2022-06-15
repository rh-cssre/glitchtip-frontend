import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, EMPTY, map, tap } from "rxjs";
import { ReleasesAPIService } from "src/app/api/releases/releases-api.service";
import { Release, ReleaseFile } from "src/app/api/releases/releases.interfaces";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "src/app/shared/stateful-service/pagination-stateful-service";

export interface ReleaseDetailState extends PaginationStatefulServiceState {
  release: Release | null;
  releaseFiles: ReleaseFile[];
  releaseFileErrors: string[];
}

const initialState: ReleaseDetailState = {
  release: null,
  releaseFiles: [],
  pagination: initialPaginationState,
  releaseFileErrors: [],
};

@Injectable({
  providedIn: "root",
})
export class ReleaseDetailService extends PaginationStatefulService<ReleaseDetailState> {
  release$ = this.getState$.pipe(map((state) => state.release));
  releaseFiles$ = this.getState$.pipe(map((state) => state.releaseFiles));
  releaseFileErrors$ = this.getState$.pipe(
    map((state) => state.releaseFileErrors)
  );
  constructor(private releasesAPIService: ReleasesAPIService) {
    super(initialState);
  }

  /** Get release detail and associated files */
  getRelease(orgSlug: string, version: string, cursor: string | undefined) {
    this.retrieveRelease(orgSlug, version).subscribe();
    this.retrieveReleaseFiles(orgSlug, version, cursor).subscribe();
  }

  getReleaseFiles(
    orgSlug: string,
    version: string,
    cursor: string | undefined
  ) {
    this.retrieveReleaseFiles(orgSlug, version, cursor).subscribe();
  }

  private retrieveRelease(orgSlug: string, version: string) {
    return this.releasesAPIService
      .retrieve(orgSlug, version)
      .pipe(tap((res) => this.setState({ release: res })));
  }

  private retrieveReleaseFiles(
    orgSlug: string,
    version: string,
    cursor: string | undefined
  ) {
    this.startPaginatedLoading();
    return this.releasesAPIService
      .listReleaseFiles(orgSlug, version, cursor)
      .pipe(
        tap((res) =>
          this.setStateAndPagination({ releaseFiles: res.body! }, res)
        ),
        catchError((err: HttpErrorResponse) => {
          this.setReleaseFileErrors(err);
          return EMPTY;
        })
      );
  }

  startPaginatedLoading() {
    const state = this.state.getValue();
    this.setState({
      releaseFileErrors: [],
      pagination: {
        ...state.pagination,
        loading: true,
        initialLoadComplete: false,
      },
    });
  }

  private setReleaseFileErrors(err: HttpErrorResponse) {
    const state = this.state.getValue();
    this.setState({
      releaseFileErrors: this.updateErrorMessage(err),
      pagination: {
        ...state.pagination,
        loading: false,
        initialLoadComplete: true,
      },
    });
  }

  private updateErrorMessage(err: HttpErrorResponse): string[] {
    if (err.error) {
      const errorValues: string[][] = Object.values<string[]>(err.error);
      return errorValues.reduce((a, v) => a.concat(v), []);
    } else {
      return [err.message];
    }
  }
}
