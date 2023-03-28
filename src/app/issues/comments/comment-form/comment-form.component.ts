import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
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
  @Output() cancelUpdate = new EventEmitter<number>

  commentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
  });

  commentFormText = this.commentForm.get("text") as FormControl;

  ngOnInit() {
    if (this.comment) {
      this.commentFormText.setValue(this.comment.data.text)
    }
  }

  emitCancelUpdate() {
    this.cancelUpdate.emit(+this.comment!.id)
  }

  submitComment() {
    if (this.commentForm.valid) {
      this.commentSubmitted.emit({
        text: this.commentFormText.value,
        id: this.comment ? +this.comment.id : undefined
      });
      this.commentForm.reset()
    }
  }
}
