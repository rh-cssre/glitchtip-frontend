import { Component, ChangeDetectionStrategy, inject, signal } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import {
  DemoConfirmDialog,
  DemoConfirmData,
} from "../docs/demo-confirm-dialog.component";
import { ApiRow, KeyRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-confirm-dialog",
  imports: [MatDialogModule, MatButtonModule, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .demo-row {
        display: flex;
        align-items: center;
        gap: var(--gt-space-4);
      }
      .demo-result {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Confirm dialog"
      status="stable"
      description="The confirmation step in front of every destructive or irreversible action (deleting an organization, revoking a token, bulk-resolving issues). Open it with MatDialog and act on the boolean it resolves with."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="Material's dialog traps focus, restores it on close, and closes on Escape. Cancel is always available and is the safe default."
      [keyboard]="keyboard"
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Live example</div>
        <div class="demo-row">
          <button mat-stroked-button color="warn" (click)="openDialog()">
            Delete project
          </button>
          @if (lastResponse() !== null) {
            <span class="demo-result">
              Dialog returned: {{ lastResponse() }}
            </span>
          }
        </div>
      </div>
    </preview-doc>
  `,
})
export class ConfirmDialogPreview {
  private readonly dialog = inject(MatDialog);
  readonly lastResponse = signal<boolean | null>(null);

  readonly whenToUse = [
    "Before any destructive or irreversible action",
    "Before bulk operations that affect many records at once",
  ];
  readonly dos = [
    "Name the consequence in the message (what exactly gets deleted)",
    "Use a verb for confirmText (Delete, Revoke), not Yes/OK",
    "Make the two actions read differently: the confirm is an outlined warn button, cancel is plain text (see Buttons & actions)",
    "Put cancel first (left) and the destructive action second (right)",
    "Give cancel cdkFocusInitial, so an accidental Enter cancels instead of deleting",
    "Act only when the dialog resolves true",
  ];
  readonly donts = [
    "Use it to confirm low-risk actions people take often",
    "Stack a second dialog on top of it",
  ];
  readonly content = [
    "Title asks the question: Delete project?",
    "Message names what happens: the project and all its events are deleted",
    "Say when the action cannot be undone",
    "Confirm button repeats the verb: Delete, not Yes or OK",
  ];
  readonly keyboard: KeyRow[] = [
    { keys: "Escape", description: "Cancel and close (the safe default)" },
    { keys: "Tab / Shift+Tab", description: "Move between Cancel and Confirm" },
    { keys: "Enter", description: "Activate the focused button" },
  ];
  readonly composition = {
    within: ["Dialogs"],
    contains: ["Buttons & actions"],
  };
  readonly api: ApiRow[] = [
    { name: "data.title", type: "string", default: "", description: "Dialog heading" },
    { name: "data.message", type: "string", default: "", description: "Body text naming the consequence" },
    { name: "data.confirmText", type: "string", default: "", description: "Primary button label (a verb)" },
    { name: "data.cancelText", type: "string", default: `"Cancel"`, description: "Cancel button label" },
    { name: "afterClosed()", type: "Observable<boolean>", default: "", description: "true when confirmed; falsy on cancel/Escape" },
  ];
  readonly importCode = `import { ConfirmDialogComponent, ConfirmDialogData } from "src/app/shared/confirm-dialog/confirm-dialog.component";`;
  readonly code = `const ref = this.dialog.open(ConfirmDialogComponent, {
  data: {
    title: "Delete project?",
    message: "frontend and all of its events will be permanently deleted.",
    confirmText: "Delete",
  },
});
ref.afterClosed().subscribe((confirmed) => {
  if (confirmed) this.deleteProject();
});`;

  openDialog(): void {
    const data: DemoConfirmData = {
      title: "Delete project?",
      message:
        "frontend and all of its events will be permanently deleted. This cannot be undone.",
      confirmText: "Delete",
    };
    this.dialog
      .open(DemoConfirmDialog, { data })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) =>
        this.lastResponse.set(!!confirmed),
      );
  }
}
