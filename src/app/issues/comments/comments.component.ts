import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { map, tap } from "rxjs/operators";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
import { CommentsState, CommentsService } from "./comments.service";
import { Comment } from "src/app/api/comments/comments.interfaces";
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
  comments$ = this.commentsService.comments$;
  loading$ = this.commentsService.commentsListLoading$;
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

  checkCommentUser(comment: Comment) {
    lastValueFrom(
      this.user$.pipe(map((user) => user?.id === comment.user?.id))
    );
  }

  createOrUpdateComment(data: { text: string; commentId?: number }) {
    lastValueFrom(
      this.route.params.pipe(
        tap((params) => {
          this.commentsService.createOrUpdateComment(
            +params["issue-id"],
            data.text,
            data.commentId
          );
        })
      )
    );
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
