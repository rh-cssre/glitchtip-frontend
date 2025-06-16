import { Component, OnInit, computed, inject, input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { tap } from "rxjs/operators";
import { CommentsService } from "./comments.service";
import { UserService } from "src/app/api/user/user.service";
import { MarkdownModule } from "ngx-markdown";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { CommentFormComponent } from "./comment-form/comment-form.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DatePipe } from "@angular/common";

@Component({
  selector: "gt-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
  imports: [
    MatProgressSpinnerModule,
    CommentFormComponent,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MarkdownModule,
    DatePipe,
  ],
})
export class CommentsComponent implements OnInit {
  private userService = inject(UserService);
  protected route = inject(ActivatedRoute);
  commentsService = inject(CommentsService);

  comments = this.commentsService.commentsWithUIState;
  createCommentLoading = this.commentsService.createCommentLoading;
  commentsListLoading = this.commentsService.commentsListLoading;
  commentUpdateLoading = this.commentsService.commentUpdateLoading;
  user = this.userService.user;
  displayCommentCreation = computed(() => this.comments().length < 50);
  issueID = input.required<string>({ alias: "issue-id" });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["issue-id"]) {
        this.commentsService.issueID.set(params["issue-id"]);
      }
    });
  }

  createOrUpdateComment(data: { text: string; id?: number }) {
    if (data.id) {
      this.commentsService.updateComment(+this.issueID(), data.id, data.text);
    } else {
      this.commentsService.createComment(+this.issueID(), data.text);
    }
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
          }),
        ),
      );
  }
}
