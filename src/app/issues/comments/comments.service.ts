import { Injectable } from "@angular/core";
import { map, tap, catchError } from "rxjs/operators";
import { EMPTY, lastValueFrom } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { CommentsAPIService } from "src/app/api/comments/comments-api.service";
import { Comment } from "src/app/api/comments/comments.interfaces";

export interface CommentsState {
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
};

@Injectable({
  providedIn: "root",
})
export class CommentsService extends StatefulService<CommentsState> {
  comments$ = this.getState$.pipe(map((state) => state.comments));
  error$ = this.getState$.pipe(map((state) => state.error));
  commentsListLoading$ = this.getState$.pipe(
    map((state) => state.commentsListLoading)
  );

  constructor(
    private commentsAPIService: CommentsAPIService,
    private snackbar: MatSnackBar
  ) {
    super(initialState);
  }

  getComments(issueId: number) {
    this.setCommentsLoadingStart();
    lastValueFrom(
      this.commentsAPIService.list(issueId).pipe(
        tap((res) => {
          this.setCommentsLoadingComplete(res);
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

  createOrUpdateComment(issueId: number, text: string, commentId?: number) {
    if (commentId) {
      console.log("Comment updated");
    } else {
      this.createComment(issueId, text);
    }
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

  deleteComment(issueId: number, commentId: number) {
    lastValueFrom(
      this.commentsAPIService.destroy(issueId, commentId).pipe(
        tap(() => {
          this.setCommentDeleteComplete(commentId);
          this.snackbar.open("Comment deleted.");
        }),
        catchError(
          () => "There was an error deleting this comment. Please try again."
        )
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
      comments: [comment].concat(state.comments),
    });
  }

  private setCreateCommentLoadingError() {
    this.setState({
      createCommentLoading: false,
    });
  }

  private setCommentDeleteComplete(commentId: number) {
    const state = this.state.getValue();
    this.setState({
      comments: state.comments.filter((comment) => comment.id !== commentId),
    });
  }
}
