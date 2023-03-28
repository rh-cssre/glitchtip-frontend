import { Injectable } from "@angular/core";
import { map, tap, catchError } from "rxjs/operators";
import { EMPTY, lastValueFrom } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { CommentsAPIService } from "src/app/api/comments/comments-api.service";
import { Comment } from "src/app/api/comments/comments.interfaces";

export interface CommentsState {
  comments: Comment[];
  updateModeComments: number[];
  commentsListLoading: boolean;
  createCommentLoading: boolean;
  commentUpdateLoading: number[];
  commentDeleteLoading: number[];
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  updateModeComments: [],
  commentsListLoading: false,
  createCommentLoading: false,
  commentUpdateLoading: [],
  commentDeleteLoading: [],
  error: null,
};

@Injectable({
  providedIn: "root",
})
export class CommentsService extends StatefulService<CommentsState> {
  commentsWithUIState$ = this.getState$.pipe(
    map((state) =>
      state.comments.map((comment) => {
        return {
          ...comment,
          updateMode: state.updateModeComments.includes(comment.id),
          updateLoading: state.commentUpdateLoading.includes(comment.id),
          deleteLoading: state.commentDeleteLoading.includes(comment.id),
        };
      })
    )
  );
  error$ = this.getState$.pipe(map((state) => state.error));
  commentsListLoading$ = this.getState$.pipe(
    map((state) => state.commentsListLoading)
  );
  createCommentLoading$ = this.getState$.pipe(
    map((state) => state.createCommentLoading)
  );
  commentUpdateLoading$ = this.getState$.pipe(
    map((state) => state.commentUpdateLoading)
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

  triggerCommentUpdateMode(commentId: number) {
    this.setCommentUpdateMode(commentId);
  }

  cancelCommentUpdateMode(commentId: number) {
    this.setCommentUpdateModeCancel(commentId);
  }

  updateComment(issueId: number, commentId: number, text: string) {
    this.setCommentUpdateLoadingStart(commentId);
    lastValueFrom(
      this.commentsAPIService.update(issueId, commentId, text).pipe(
        tap((comment) => {
          this.setCommentUpdateComplete(comment);
          this.snackbar.open("Comment updated");
        }),
        catchError(() => {
          this.setCommentUpdateLoadingError(commentId);
          this.snackbar.open(
            "There was a problem updating this comment, please try again"
          );
          return EMPTY;
        })
      )
    );
  }

  deleteComment(issueId: number, commentId: number) {
    this.setCommentDeleteLoadingStart(commentId);
    lastValueFrom(
      this.commentsAPIService.destroy(issueId, commentId).pipe(
        tap(() => {
          this.setCommentDeleteComplete(commentId);
          this.snackbar.open("Comment deleted.");
        }),
        catchError(() => {
          this.setCommentDeleteError(commentId);
          this.snackbar.open(
            "There was an error deleting this comment. Please try again."
          );
          return EMPTY;
        })
      )
    );
  }

  protected findAndReplaceComment(
    currentComments: Comment[],
    newComment: Comment
  ): Comment[] {
    const updatedComments = currentComments?.map((comment) => {
      if (comment.id === newComment.id) {
        return newComment;
      } else return comment;
    });
    return updatedComments;
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

  private setCommentUpdateMode(commentId: number) {
    const state = this.state.getValue();
    this.setState({
      updateModeComments: state.updateModeComments.concat(commentId),
    });
  }

  private setCommentUpdateModeCancel(commentId: number) {
    const state = this.state.getValue();
    this.setState({
      updateModeComments: state.updateModeComments.filter(
        (id) => id !== commentId
      ),
    });
  }

  private setCommentUpdateLoadingStart(commentId: number) {
    const state = this.state.getValue();
    this.setState({
      commentUpdateLoading: state.updateModeComments.concat(commentId),
    });
  }

  private setCommentUpdateLoadingError(commentId: number) {
    const state = this.state.getValue();
    this.setState({
      commentUpdateLoading: state.updateModeComments.filter(
        (id) => id !== commentId
      ),
    });
  }

  private setCommentUpdateComplete(comment: Comment) {
    const state = this.state.getValue();
    this.setState({
      comments: this.findAndReplaceComment(state.comments, comment),
      updateModeComments: state.updateModeComments.filter(
        (id) => id !== comment.id
      ),
      commentUpdateLoading: state.commentUpdateLoading.filter(
        (id) => id !== comment.id
      ),
    });
  }

  private setCommentDeleteLoadingStart(commentId: number) {
    const state = this.state.getValue();
    this.setState({
      commentDeleteLoading: state.commentDeleteLoading.concat(commentId),
    });
  }

  private setCreateCommentLoadingComplete(comment: Comment) {
    const state = this.state.getValue();
    this.setState({
      createCommentLoading: false,
      comments: [comment].concat(state.comments),
    });
  }

  private setCommentDeleteError(commentId: number) {
    const state = this.state.getValue();
    this.setState({
      commentDeleteLoading: state.commentDeleteLoading.filter(
        (id) => id !== commentId
      ),
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
      commentDeleteLoading: state.commentDeleteLoading.filter(
        (id) => id !== commentId
      ),
    });
  }
}
