import { Injectable, computed, inject, resource, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IssueDetailService } from "../issue-detail/issue-detail.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client } from "src/app/shared/api/api";
import { components } from "src/app/api/api-schema";

type Comment = components["schemas"]["CommentSchema"];

export interface CommentsState {
  updateModeComments: number[];
  createCommentLoading: boolean;
  commentUpdateLoading: number[];
  commentDeleteLoading: number[];
}

const initialState: CommentsState = {
  updateModeComments: [],
  createCommentLoading: false,
  commentUpdateLoading: [],
  commentDeleteLoading: [],
};

@Injectable()
export class CommentsService extends StatefulService<CommentsState> {
  private issueDetailService = inject(IssueDetailService);
  private snackbar = inject(MatSnackBar);
  issueID = signal<number | undefined>(undefined);

  private commentsResource = resource({
    params: () => ({ issueID: this.issueID() }),
    loader: async ({ params }) => {
      if (!params.issueID) {
        return undefined;
      }
      const { data, error } = await client.GET(
        "/api/0/issues/{issue_id}/comments/",
        {
          params: {
            path: { issue_id: params.issueID },
          },
        },
      );
      if (error) {
        this.snackbar.open(
          $localize`Something went wrong. Try reloading the page.`,
        );
      }
      return data;
    },
  });

  comments = computed(() => {
    return this.commentsResource.value() || [];
  });

  commentsWithUIState = computed(() => {
    return this.comments().map((comment) => {
      return {
        ...comment,
        updateMode: this.state().updateModeComments.includes(comment.id!),
        updateLoading: this.state().commentUpdateLoading.includes(comment.id!),
        deleteLoading: this.state().commentDeleteLoading.includes(comment.id!),
      };
    });
  });

  commentsListLoading = computed(() => this.commentsResource.isLoading());

  createCommentLoading = computed(() => {
    return this.state().createCommentLoading;
  });

  commentUpdateLoading = computed(() => {
    return this.state().commentUpdateLoading;
  });

  constructor() {
    super(initialState);
  }

  async createComment(issueId: number, text: string) {
    this.setCreateCommentLoadingStart();
    const { data, error } = await client.POST(
      "/api/0/issues/{issue_id}/comments/",
      {
        params: { path: { issue_id: issueId } },
        body: { data: { text } },
      },
    );
    if (data?.data) {
      this.setCreateCommentLoadingComplete(data);
      this.issueDetailService.updateCommentCount(1);
    }
    if (error) {
      this.setCreateCommentLoadingError();
      this.snackbar.open(
        "There was a problem posting this comment, please try again",
      );
    }
  }

  triggerCommentUpdateMode(commentId: number) {
    this.setCommentUpdateMode(commentId);
  }

  cancelCommentUpdateMode(commentId: number) {
    this.setCommentUpdateModeCancel(commentId);
  }

  async updateComment(issueId: number, commentId: number, text: string) {
    this.setCommentUpdateLoadingStart(commentId);
    const { data, error } = await client.PUT(
      "/api/0/issues/{issue_id}/comments/{comment_id}/",
      {
        params: {
          path: {
            issue_id: issueId,
            comment_id: commentId,
          },
        },
        body: {
          data: { text },
        },
      },
    );
    if (error) {
      this.setCommentUpdateLoadingError(commentId);
      this.snackbar.open(
        "There was a problem updating this comment, please try again",
      );
    }
    if (data) {
      this.setCommentUpdateComplete(data);
      this.snackbar.open("Comment updated");
    }
  }

  async deleteComment(issueId: number, commentId: number) {
    this.setCommentDeleteLoadingStart(commentId);
    const { error, response } = await client.DELETE(
      "/api/0/issues/{issue_id}/comments/{comment_id}/",
      {
        params: {
          path: {
            issue_id: issueId,
            comment_id: commentId,
          },
        },
      },
    );
    if (error) {
      this.setCommentDeleteError(commentId);
      this.snackbar.open(
        $localize`There was an error deleting this comment. Please try again.`,
      );
    }
    if (response.status === 204) {
      this.setCommentDeleteComplete(commentId);
      this.issueDetailService.updateCommentCount(-1);
      this.snackbar.open("Comment deleted.");
    }
  }

  protected findAndReplaceComment(
    currentComments: Comment[],
    newComment: Comment,
  ): Comment[] {
    const updatedComments = currentComments?.map((comment) => {
      if (comment.id === newComment.id) {
        return newComment;
      } else return comment;
    });
    return updatedComments;
  }

  private setCreateCommentLoadingStart() {
    this.setState({
      createCommentLoading: true,
    });
  }

  private setCreateCommentLoadingComplete(comment: Comment) {
    this.setState({
      createCommentLoading: false,
    });
    this.commentsResource.update((comments) => [comment].concat(comments!));
  }

  private setCreateCommentLoadingError() {
    this.setState({
      createCommentLoading: false,
    });
  }

  private setCommentUpdateMode(commentId: number) {
    const state = this.state();
    this.setState({
      updateModeComments: state.updateModeComments.concat(commentId),
    });
  }

  private setCommentUpdateModeCancel(commentId: number) {
    const state = this.state();
    this.setState({
      updateModeComments: state.updateModeComments.filter(
        (id) => id !== commentId,
      ),
    });
  }

  private setCommentUpdateLoadingStart(commentId: number) {
    const state = this.state();
    this.setState({
      commentUpdateLoading: state.commentUpdateLoading.concat(commentId),
    });
  }

  private setCommentUpdateLoadingError(commentId: number) {
    const state = this.state();
    this.setState({
      commentUpdateLoading: state.commentUpdateLoading.filter(
        (id) => id !== commentId,
      ),
    });
  }

  private setCommentUpdateComplete(comment: Comment) {
    const state = this.state();
    this.setState({
      updateModeComments: state.updateModeComments.filter(
        (id) => id !== comment.id,
      ),
      commentUpdateLoading: state.commentUpdateLoading.filter(
        (id) => id !== comment.id,
      ),
    });
    this.commentsResource.update((comments) =>
      this.findAndReplaceComment(comments!, comment),
    );
  }

  private setCommentDeleteLoadingStart(commentId: number) {
    const state = this.state();
    this.setState({
      commentDeleteLoading: state.commentDeleteLoading.concat(commentId),
    });
  }

  private setCommentDeleteComplete(commentId: number) {
    const state = this.state();
    this.setState({
      commentDeleteLoading: state.commentDeleteLoading.filter(
        (id) => id !== commentId,
      ),
    });
    this.commentsResource.update((comments) =>
      comments!.filter((comment) => comment.id !== commentId),
    );
  }

  private setCommentDeleteError(commentId: number) {
    const state = this.state();
    this.setState({
      commentDeleteLoading: state.commentDeleteLoading.filter(
        (id) => id !== commentId,
      ),
    });
  }
}
