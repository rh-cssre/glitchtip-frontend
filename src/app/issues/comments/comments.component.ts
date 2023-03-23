import { Component, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { tap } from "rxjs/operators";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { CommentsState, CommentsService } from "./comments.service";

@Component({
  selector: "gt-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent
  extends PaginationBaseComponent<CommentsState, CommentsService>
  implements OnDestroy
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
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(commentsService, router, route);
    this.activeCombinedParams$.subscribe(
      ([params, queryParams]) => {
        if (params["issue-id"]) {
          this.commentsService.getComments(
            params["issue-id"],
            queryParams.cursor
          );
        }
      }
    );
  }

  submitNewComment() {
    if (this.newCommentForm.valid) {
      lastValueFrom(
        this.route.params.pipe(
          tap((params) => {
            this.commentsService.createComment(
              +params["issue-id"],
              this.newCommentFormText.value
            );
          })
        )
      );
    }
  }

  ngOnDestroy() {}
}
