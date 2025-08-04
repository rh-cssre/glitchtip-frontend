import { Component, OnInit, input, output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";

import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

import { components } from "src/app/api/api-schema";

type Comment = components["schemas"]["CommentSchema"];

@Component({
  selector: "gt-comment-form",
  templateUrl: "./comment-form.component.html",
  styleUrls: ["./comment-form.component.scss"],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingButtonComponent,
    MatButtonModule,
  ],
})
export class CommentFormComponent implements OnInit {
  readonly comment = input<Comment>();
  readonly loading = input.required<boolean>();
  readonly commentSubmitted = output<{
    text: string;
    id?: number;
  }>();
  readonly cancelUpdate = output<number>();

  commentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
  });

  commentFormText = this.commentForm.get("text") as FormControl;

  ngOnInit() {
    const comment = this.comment();
    if (comment) {
      this.commentFormText.setValue(comment.data.text);
    }
  }

  disableSubmissions() {
    const comment = this.comment();
    return comment && this.commentFormText.value === comment.data.text
      ? true
      : false;
  }

  emitCancelUpdate() {
    this.cancelUpdate.emit(this.comment()!.id!);
  }

  //Reset must be called on FormGroupDirective
  //to avoid displaying validation error after submission
  submitComment(formDirective: FormGroupDirective) {
    if (this.commentForm.valid) {
      const comment = this.comment();
      this.commentSubmitted.emit({
        text: this.commentFormText.value,
        id: comment ? comment.id! : undefined,
      });
      formDirective.resetForm();
    }
  }
}
