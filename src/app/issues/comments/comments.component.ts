import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { tap } from "rxjs/operators";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
import { CommentsState, CommentsService } from "./comments.service";

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

  newCommentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
  });

  newCommentFormText = this.newCommentForm.get("text") as FormControl;

  constructor(
    private commentsService: CommentsService,
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
}
