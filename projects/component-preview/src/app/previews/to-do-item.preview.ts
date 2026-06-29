import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ToDoItemComponent } from "src/app/shared/to-do-item/to-do-item.component";

@Component({
  selector: "preview-to-do-item",
  imports: [ToDoItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preview-section" style="max-width: 420px">
      <div class="preview-section__title">Wizard steps</div>
      <gt-to-do-item title="Create your account" isDone="true" />
      <gt-to-do-item title="Set up a project" isDone="doing" />
      <gt-to-do-item title="Send your first event" isDone="false" />
    </div>
  `,
})
export class ToDoItemPreview {}
