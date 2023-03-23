import { Injectable } from "@angular/core";
import { map, tap, catchError } from "rxjs/operators";
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
  commentsListLoading: boolean;
  createCommentLoading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  commentsListLoading: false,
  createCommentLoading: false,
  error: null,
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class CommentsService extends PaginationStatefulService<CommentsState> {
  comments$ = this.getState$.pipe(map((state) => state.comments));
  error$ = this.getState$.pipe(map((state) => state.error));
  commentsListLoading$ = this.getState$.pipe(
    map((state) => state.commentsListLoading)
  );

  constructor(private commentsAPIService: CommentsAPIService) {
    super(initialState);
  }

  getComments(issueId: number, cursor: string | undefined) {
    this.setCommentsLoadingStart();
    lastValueFrom(
      this.commentsAPIService.list(issueId, cursor).pipe(
        tap((response) => {
          this.setCommentsLoadingComplete(response);
        }),
        catchError((error) => {
          this.setCommentsLoadingError(
            "Something went wrong. Try reloading the page."
          );
          return EMPTY;
        })
      )
    );
  }

  createComment(issueId: number, text: string) {
    this.setCreateCommentLoadingStart();
    lastValueFrom(
      this.commentsAPIService.create(issueId, text).pipe(
        tap((resp) => {
          this.setCreateCommentLoadingComplete(resp);
        }),
        catchError((err) => {
          this.setCreateCommentLoadingError();
          return EMPTY;
        })
      )
    );
  }

  private setCommentsLoadingStart() {
    this.setState({ commentsListLoading: true });
  }

  private setCommentsLoadingComplete(comments: Comment[]) {
    this.setState({
      commentsListLoading: false,
      comments,
    });
  }

  private setCommentsLoadingError(error: string) {
    this.setState({
      commentsListLoading: false,
      error,
    });
  }

  private setCreateCommentLoadingStart() {
    this.setState({
      createCommentLoading: true,
    });
  }

  private setCreateCommentLoadingComplete(comment: Comment) {
    const state = this.state.getValue();
    this.setState({
      createCommentLoading: false,
      comments: state.comments?.concat([comment]),
    });
  }

  private setCreateCommentLoadingError() {
    this.setState({
      createCommentLoading: false,
    });
  }
}
