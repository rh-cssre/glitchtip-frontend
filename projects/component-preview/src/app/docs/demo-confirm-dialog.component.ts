import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DemoConfirmData {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
}

/**
 * The confirmation dialog as it SHOULD look, per the destructive rule: a plain
 * text cancel and an outlined warn confirm, so the two read differently and the
 * destructive action is marked without being a filled red button. Cancel comes
 * first and takes initial focus, so an accidental Enter cancels rather than
 * deletes. The shipped ConfirmDialogComponent now matches this (ticket P12).
 */
@Component({
  selector: "preview-demo-confirm-dialog",
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button cdkFocusInitial [mat-dialog-close]="false">
        {{ data.cancelText || "Cancel" }}
      </button>
      <button mat-stroked-button color="warn" [mat-dialog-close]="true">
        {{ data.confirmText }}
      </button>
    </mat-dialog-actions>
  `,
})
export class DemoConfirmDialog {
  readonly data = inject<DemoConfirmData>(MAT_DIALOG_DATA);
}
