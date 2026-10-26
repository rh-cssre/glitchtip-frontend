import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Toasts (Material snackbars) for transient feedback, and how to choose between
 * a toast, a banner, and an inline message.
 */
@Component({
  selector: "preview-toasts",
  imports: [MatButtonModule, MatSnackBarModule, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .to-row {
        display: flex;
        gap: var(--gt-space-3);
        flex-wrap: wrap;
      }
      .to-table {
        width: 100%;
        border-collapse: collapse;
        font: var(--mat-sys-body-medium);
        max-width: 720px;
      }
      .to-table th,
      .to-table td {
        text-align: left;
        vertical-align: top;
        padding: var(--gt-space-2) var(--gt-space-3);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
      .to-table th {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Toasts"
      status="stable"
      description="A toast (Material snackbar) is brief, transient feedback that confirms something just happened, then dismisses itself. It sits at the bottom, shows one line, and carries at most one action. Use it for confirmations, not for anything the user must act on."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="Material announces the snackbar politely to screen readers. Give an action enough time to be reached before it dismisses; never put the only path to an action inside a toast that disappears."
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Try it</div>
        <div class="to-row">
          <button mat-flat-button color="primary" (click)="saved()">
            Save
          </button>
          <button mat-stroked-button (click)="undo()">Delete with undo</button>
        </div>
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">Toast, banner, or inline?</div>
        <p class="preview-section__note">
          Match the pattern to how long the message matters.
        </p>
        <table class="to-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Lifetime</th>
              <th>Use for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Toast</td>
              <td>Transient, dismisses itself</td>
              <td>Confirming a completed action: saved, deleted, copied</td>
            </tr>
            <tr>
              <td>Banner</td>
              <td>Persists until resolved</td>
              <td>Account state or a standing call to action: usage limit, upgrade</td>
            </tr>
            <tr>
              <td>Inline (mat-error, gt-form-error)</td>
              <td>Until the user fixes it</td>
              <td>Validation and field-level errors</td>
            </tr>
          </tbody>
        </table>
      </div>
    </preview-doc>
  `,
})
export class ToastsPreview {
  private readonly snackBar = inject(MatSnackBar);

  saved(): void {
    this.snackBar.open("Changes saved", "", { duration: 3000 });
  }
  undo(): void {
    this.snackBar.open("Project deleted", "Undo", { duration: 5000 });
  }

  readonly whenToUse = [
    "Confirming a completed action (saved, deleted, copied)",
    "A brief, non-critical status the user does not need to act on",
  ];
  readonly dos = [
    "Keep it to one line and at most one action",
    "Let it auto-dismiss; do not require a click to close",
    "Show one at a time",
    "Give an undo action enough time to be reached",
  ];
  readonly donts = [
    "Use a toast for an error the user must fix; use inline or a banner",
    "Put standing account state in a toast; that is a banner",
    "Stack several toasts at once",
  ];
  readonly content = [
    "Confirm in plain past tense: Changes saved, Project deleted",
    "The action is a verb: Undo, not OK",
    "Do not add an exclamation mark",
  ];
  readonly code = `private snackBar = inject(MatSnackBar);

// confirmation, auto-dismiss
this.snackBar.open("Changes saved", "", { duration: 3000 });

// with a reversible action
this.snackBar.open("Project deleted", "Undo", { duration: 5000 })
  .onAction().subscribe(() => this.restore());`;
}
