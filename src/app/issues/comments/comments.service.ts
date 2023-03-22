import { Injectable } from "@angular/core";
import { map, tap, catchError, } from "rxjs/operators";
import { EMPTY, lastValueFrom } from "rxjs";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "src/app/shared/stateful-service/pagination-stateful-service";
import { CommentsAPIService } from "src/app/api/comments/comments-api.service";
import { Comment } from "src/app/api/comments/comments.interfaces";

export interface CommentsState extends PaginationStatefulServiceState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class CommentsService extends PaginationStatefulService<CommentsState> {
  comments$ = this.getState$.pipe(map((state) => state.comments));
  error$ = this.getState$.pipe(map((state) => state.error));
  loading$ = this.getState$.pipe(map((state) => state.loading));

  constructor(
    private commentsAPIService: CommentsAPIService,
  ) {
    super(initialState);
  }

  getComments(issueId: number, cursor: string | undefined) {
    this.setCommentsLoadingStart()
    lastValueFrom(this.commentsAPIService.list(issueId, cursor).pipe(
      tap((response) => {
        this.setCommentsLoadingComplete(response)
      }),
      catchError((error) => {
        this.setCommentsLoadingError(
          "Something went wrong. Try reloading the page."
        )
        return EMPTY
      })
    ))
  }

  private setCommentsLoadingStart() {
    this.setState({ loading: true })
  }

  private setCommentsLoadingComplete(comments: Comment[]) {
    this.setState({
      loading: false,
      comments
    })
  }

  private setCommentsLoadingError(error: string) {
    this.setState({
      loading: false,
      error 
    })
  }  
}
