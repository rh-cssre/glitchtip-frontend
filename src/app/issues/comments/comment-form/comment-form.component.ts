import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { Comment } from "src/app/api/comments/comments.interfaces";

@Component({
  selector: "gt-comment-form",
  templateUrl: "./comment-form.component.html",
  styleUrls: ["./comment-form.component.scss"],
})
export class CommentFormComponent implements OnInit {
  @Input() comment?: Comment;
  @Input() loading!: boolean;
  @Output() commentSubmitted = new EventEmitter<{
    text: string;
    id?: number;
  }>();
  @Output() cancelUpdate = new EventEmitter<number>();

  commentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
  });

  commentFormText = this.commentForm.get("text") as FormControl;

  ngOnInit() {
    if (this.comment) {
      this.commentFormText.setValue(this.comment.data.text);
    }
  }

  disableSubmissions() {
    return this.comment && this.commentFormText.value === this.comment.data.text
      ? true
      : false;
  }

  emitCancelUpdate() {
    this.cancelUpdate.emit(this.comment!.id);
  }

  //Reset must be called on FormGroupDirective
  //to avoid displaying validation error after submission
  submitComment(formDirective: FormGroupDirective) {
    if (this.commentForm.valid) {
      this.commentSubmitted.emit({
        text: this.commentFormText.value,
        id: this.comment ? this.comment.id : undefined,
      });
      formDirective.resetForm();
    }
  }
}
