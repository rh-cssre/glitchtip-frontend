import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { tap } from "rxjs/operators";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
import { CommentsState, CommentsService } from "./comments.service";
import { UserService } from "src/app/api/user/user.service";

@Component({
  selector: "gt-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent
  extends StatefulBaseComponent<CommentsState, CommentsService>
  implements OnDestroy, OnInit
{
  comments$ = this.commentsService.commentsWithUIState$;
  createCommentLoading$ = this.commentsService.createCommentLoading$;
  commentsListLoading$ = this.commentsService.commentsListLoading$;
  commentUpdateLoading$ = this.commentsService.commentUpdateLoading$;
  errorReports$ = this.commentsService.error$;
  user$ = this.userService.userDetails$;

  newCommentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
  });

  newCommentFormText = this.newCommentForm.get("text") as FormControl;

  constructor(
    private commentsService: CommentsService,
    private userService: UserService,
    protected route: ActivatedRoute
  ) {
    super(commentsService);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["issue-id"]) {
        this.commentsService.getComments(params["issue-id"]);
      }
    });
  }

  createOrUpdateComment(data: { text: string; id?: number }) {
    lastValueFrom(
      this.route.params.pipe(
        tap((params) => {
          if (data.id) {
            this.commentsService.updateComment(
              +params["issue-id"],
              data.id,
              data.text
            );
          } else {
            this.commentsService.createComment(+params["issue-id"], data.text);
          }
        })
      )
    );
  }

  triggerCommentUpdateMode(commentId: number) {
    this.commentsService.triggerCommentUpdateMode(commentId);
  }

  cancelCommentUpdateMode(commentId: number) {
    this.commentsService.cancelCommentUpdateMode(commentId);
  }

  deleteComment(commentId: number) {
    lastValueFrom(
      this.route.params.pipe(
        tap((params) => {
          this.commentsService.deleteComment(+params["issue-id"], commentId);
        })
      )
    );
  }
}
