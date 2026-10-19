import { Component, ChangeDetectionStrategy, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import {
  DemoConfirmDialog,
  DemoConfirmData,
} from "../docs/demo-confirm-dialog.component";
import { PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * The Dialogs pattern: which kind of dialog to use and the rules for all of
 * them. It governs by rule, not by component; the one shared component
 * (ConfirmDialogComponent) has its own page.
 */
@Component({
  selector: "preview-dialogs",
  imports: [MatButtonModule, MatDialogModule, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .dg-result {
        margin-left: var(--gt-space-3);
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }
      .dg-table {
        width: 100%;
        border-collapse: collapse;
        font: var(--mat-sys-body-medium);
        max-width: 760px;
      }
      .dg-table th,
      .dg-table td {
        text-align: left;
        vertical-align: top;
        padding: var(--gt-space-2) var(--gt-space-3);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
      .dg-table th {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Dialogs"
      status="stable"
      description="A dialog interrupts to get a decision or focused input without leaving the page. It traps focus and dims the page behind it, so use it sparingly and for one thing. Three types by purpose: confirmation, form, and info."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="Material traps focus while a dialog is open, closes on Escape, and restores focus to the trigger on close. Show one dialog at a time; never stack."
      [composition]="composition"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">The three types</div>
        <p class="preview-section__note">
          Pick by purpose. Only the confirmation is a shared component; form and
          info dialogs are built per feature to the same rules.
        </p>
        <table class="dg-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Use for</th>
              <th>Actions</th>
              <th>In the app</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Confirmation</td>
              <td>Confirming a destructive or irreversible action</td>
              <td>Cancel plus a verb-labeled confirm</td>
              <td>ConfirmDialogComponent (see Confirm dialog)</td>
            </tr>
            <tr>
              <td>Form</td>
              <td>One focused create or edit task</td>
              <td>Cancel plus a submit (gt-loading-button)</td>
              <td>New team, add recipient, payment</td>
            </tr>
            <tr>
              <td>Info</td>
              <td>Read-only detail without leaving the page</td>
              <td>Close</td>
              <td>Event info</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">Try it</div>
        <p class="preview-section__note">
          A confirmation, the most common type. Notice the focus trap and the
          dimmed page. The Confirm dialog page has the component's API.
        </p>
        <button mat-flat-button color="primary" (click)="openConfirm()">
          Delete project
        </button>
        @if (lastResult() !== null) {
          <span class="dg-result">Dialog returned: {{ lastResult() }}</span>
        }
      </div>
    </preview-doc>
  `,
})
export class DialogsPreview {
  private readonly dialog = inject(MatDialog);
  readonly lastResult = signal<boolean | null>(null);

  openConfirm(): void {
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
        this.lastResult.set(!!confirmed),
      );
  }

  readonly whenToUse = [
    "A decision or focused input that must happen before the user continues",
    "Detail a user wants to see without losing their place on the page",
  ];
  readonly dos = [
    "Pick the type by purpose: confirmation, form, or info",
    "Keep it to one task or one decision; if it grows, use a full page instead",
    "Confirmations: name the consequence and label the button with the verb (see Confirm dialog)",
    "Forms: submit with gt-loading-button and keep cancel always available",
  ];
  readonly donts = [
    "Use a dialog for a routine or safe action; it trains people to click through",
    "Stack a second dialog on top of one",
    "Put long or multi-step content in a dialog; use a page",
    "Use a dialog for transient status; that is a toast",
  ];
  readonly content = [
    "Title states the purpose in a few words: Delete project?, Create team",
    "The primary action is a verb that matches the task: Delete, Create team, Save",
    "Cancel or Close is always the safe way out",
  ];
  readonly composition = {
    contains: ["Buttons & actions", "Forms"],
  };
  readonly code = `// every dialog type opens the same way
const ref = this.dialog.open(SomeDialogComponent, { data });
ref.afterClosed().subscribe((result) => { /* act on result */ });

// confirmations use the shared component (see Confirm dialog)
this.dialog.open(ConfirmDialogComponent, {
  data: { title: "Delete project?", message: "...", confirmText: "Delete" },
});`;
}
