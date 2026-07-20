import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ToDoItemComponent } from "src/app/shared/to-do-item/to-do-item.component";
import { DoDontComponent } from "../docs/do-dont.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-to-do-item",
  imports: [ToDoItemComponent, DoDontComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .td-item {
        display: flex;
        align-items: center;
        gap: var(--gt-space-2);
        margin-bottom: var(--gt-space-2);
        font: var(--mat-sys-body-large);
      }
      .td-item:last-child {
        margin-bottom: 0;
      }
      // State is drawn in CSS, not the icon font: the ring glyphs are not in
      // the app's Material Symbols subset, and this keeps the three states a
      // consistent shape.
      .td-dot {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        flex: none;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      // Done: filled success with a centered white check; label de-emphasizes.
      .td-item--done {
        color: var(--mat-sys-on-surface-variant);
      }
      .td-item--done .td-dot {
        background-color: var(--success-color);
      }
      .td-item--done .td-dot::after {
        content: "";
        width: 4px;
        height: 8px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        // translateY optically centers the rotated check in the circle.
        transform: translateY(-1px) rotate(45deg);
      }
      // In progress: the current step. Same progress color as done, but an
      // open ring (not yet filled), plus a bold label to say "you are here".
      // One accent for the whole track, no second color.
      .td-item--doing {
        color: var(--mat-sys-on-surface);
        font-weight: 600;
      }
      .td-item--doing .td-dot {
        border: 2px solid var(--success-color);
      }
      // Not started: a muted empty ring, never alarming.
      .td-item--todo {
        color: var(--mat-sys-on-surface-variant);
      }
      .td-item--todo .td-dot {
        border: 2px solid var(--mat-sys-outline);
      }
    `,
  ],
  template: `
    <preview-doc
      title="To-do item"
      status="stable"
      [designNotes]="['shipped component uses red for not-started and an icon only on done; the ideal gives each state its own icon and a neutral not-started (ticket P18)']"
      description="A single step in a multi-step (wizard) checklist, showing whether a step is done, in progress, or not started. Use several together to guide a user through setup."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="Each state carries its own icon (check, current, empty) so status reads without color; the current step is emphasized to show where the user is. Color only reinforces the icon."
      [anatomy]="anatomy"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section preview-narrow">
        <div class="preview-section__title">Wizard steps</div>
        <preview-do-dont
          doCaption="Each state has its own icon; not-started is neutral and the current step is emphasized."
          dontCaption="Status is carried by color, and not-started is red as if the step had failed."
        >
          <div slot="do">
            <div class="td-item td-item--done">
              <span class="td-dot"></span>
              <span>Create your account</span>
            </div>
            <div class="td-item td-item--doing">
              <span class="td-dot"></span>
              <span>Set up a project</span>
            </div>
            <div class="td-item td-item--todo">
              <span class="td-dot"></span>
              <span>Send your first event</span>
            </div>
          </div>
          <div slot="dont">
            <gt-to-do-item title="Create your account" isDone="true" />
            <gt-to-do-item title="Set up a project" isDone="doing" />
            <gt-to-do-item title="Send your first event" isDone="false" />
          </div>
        </preview-do-dont>
      </div>
    </preview-doc>
  `,
})
export class ToDoItemPreview {
  readonly whenToUse = [
    "Onboarding or setup flows with sequential steps",
    "Any checklist where each item has a clear completion state",
  ];
  readonly dos = [
    "Drive isDone from the real completion state of each step",
    "Give each state its own icon: done, current, and upcoming",
    "Keep not-started neutral; reserve red for errors",
    "Keep titles short and action-oriented",
  ];
  readonly donts = [
    "Use red for a step that is simply not started yet",
    "Rely on color alone to show status",
    "Use it for a flat list with no notion of progress",
    'Pass a boolean; isDone is a string union ("false" | "doing" | "true")',
  ];
  readonly anatomy = `<gt-to-do-item [title]="..." [isDone]="..." />`;
  readonly api: ApiRow[] = [
    { name: "title", type: "string", default: `""`, description: "The step label" },
    {
      name: "isDone",
      type: `"false" | "doing" | "true"`,
      default: `"false"`,
      description: "Step status: not started, in progress, or complete",
    },
  ];
  readonly importCode = `import { ToDoItemComponent } from "src/app/shared/to-do-item/to-do-item.component";`;
  readonly code = `<gt-to-do-item
  title="Set up a project"
  isDone="doing"
/>`;
}
