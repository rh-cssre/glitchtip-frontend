import { Injectable } from "@angular/core";
import { map, tap, catchError } from "rxjs/operators";
import { EMPTY, lastValueFrom } from "rxjs";
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

  constructor(private commentsAPIService: CommentsAPIService) {
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
      console.log("Comment updated")
    } else {
      this.createComment(issueId, text)
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

  private setCommentsLoadingStart() {
    this.setState({ commentsListLoading: true });
  }

  private setCommentsLoadingComplete(comments: Comment[]) {
    this.setState({
      commentsListLoading: false,
      comments
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
