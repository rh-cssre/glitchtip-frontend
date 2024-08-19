import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { map, tap } from "rxjs/operators";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
import { CommentsState, CommentsService } from "./comments.service";
import { UserService } from "src/app/api/user/user.service";
import { MarkdownModule } from "ngx-markdown";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { CommentFormComponent } from "./comment-form/comment-form.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AsyncPipe, DatePipe } from "@angular/common";

@Component({
  selector: "gt-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommentFormComponent,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MarkdownModule,
    AsyncPipe,
    DatePipe
],
})
export class CommentsComponent
  extends StatefulBaseComponent<CommentsState, CommentsService>
  implements OnDestroy, OnInit
{
  comments$ = this.commentsService.commentsWithUIState$;
  createCommentLoading$ = this.commentsService.createCommentLoading$;
  commentsListLoading$ = this.commentsService.commentsListLoading$;
  commentUpdateLoading$ = this.commentsService.commentUpdateLoading$;
  user$ = this.userService.userDetails$;
  displayCommentCreation$ = this.comments$.pipe(
    map((comments) => comments.length < 50)
  );

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
    if (window.confirm("Are you sure you want to delete this comment?"))
      lastValueFrom(
        this.route.params.pipe(
          tap((params) => {
            this.commentsService.deleteComment(+params["issue-id"], commentId);
          })
        )
      );
  }
}
