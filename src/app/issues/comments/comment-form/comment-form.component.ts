import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: "gt-comment-form",
  templateUrl: "./comment-form.component.html",
  styleUrls: ["./comment-form.component.scss"],
})
export class CommentFormComponent {
  @Input() originalText?: string;
  @Input() commentId?: number;
  @Output() commentSubmitted = new EventEmitter<{text: string, id?: number}>();

  commentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
  });

  commentFormText = this.commentForm.get("text") as FormControl;

  submitComment() {
    if (this.commentForm.valid) {
      this.commentSubmitted.emit({
        text: this.commentFormText.value,
        id: this.commentId
      })
    }
  }
}
