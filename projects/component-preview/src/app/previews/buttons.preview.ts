import { Component, ChangeDetectionStrategy, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import {
  DemoConfirmDialog,
  DemoConfirmData,
} from "../docs/demo-confirm-dialog.component";
import { DoDontComponent } from "../docs/do-dont.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * The button and action rulebook. Live examples show the intended rules; where
 * the product does not follow them yet, a design note flags it and there is a
 * matching audit ticket.
 */
@Component({
  selector: "preview-buttons",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DoDontComponent,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .btn-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--gt-space-4);
        margin-bottom: var(--gt-space-3);
      }
      .btn-item {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-2);
        align-items: flex-start;
      }
      .btn-item__use {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        max-width: 22ch;
      }
      .btn-result {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        margin-top: var(--gt-space-2);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Buttons & actions"
      status="stable"
      description="How to choose and style buttons. Pick the style by how much emphasis the action needs, keep one primary action per view, and treat destructive actions consistently."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="Icon-only buttons need an aria-label that names the action. Keep a real text label on the primary action so screen readers announce it."
      [api]="api"
      [code]="code"
      [designNotes]="['rulebook: product not fully aligned yet']"
    >
      <div class="preview-section">
        <div class="preview-section__title">Emphasis</div>
        <p class="preview-section__note">
          Higher emphasis draws more attention. Use one filled button per view.
        </p>
        <div class="btn-row">
          <div class="btn-item">
            <button mat-flat-button color="primary">Save</button>
            <span class="btn-item__use">Filled: the main action</span>
          </div>
          <div class="btn-item">
            <button mat-stroked-button>Invite member</button>
            <span class="btn-item__use">Outlined: a secondary action</span>
          </div>
          <div class="btn-item">
            <button mat-button>Cancel</button>
            <span class="btn-item__use">Text: cancel, dismiss, tertiary</span>
          </div>
          <div class="btn-item">
            <button mat-icon-button aria-label="More">
              <mat-icon>more_vert</mat-icon>
            </button>
            <span class="btn-item__use">Icon: a compact action</span>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Icon buttons</div>
        <p class="preview-section__note">
          Plain, in two sizes. If an icon action needs to read as a standalone
          button, give it a label rather than an icon alone.
        </p>
        <div class="btn-row">
          <div class="btn-item">
            <button
              mat-icon-button
              class="small-icon-button"
              aria-label="Edit"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <span class="btn-item__use">Small (24) for rows and inputs</span>
          </div>
          <div class="btn-item">
            <button
              mat-icon-button
              class="medium-icon-button"
              aria-label="Settings"
            >
              <mat-icon>settings</mat-icon>
            </button>
            <span class="btn-item__use">Medium (36) for toolbars</span>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Icon with text</div>
        <p class="preview-section__note">
          Put the icon before the label. Trailing is only for an external-link
          cue.
        </p>
        <div class="btn-row">
          <button mat-flat-button color="primary">
            <mat-icon>add</mat-icon>
            New project
          </button>
          <a mat-stroked-button href="https://glitchtip.com" target="_blank">
            Docs
            <mat-icon iconPositionEnd>open_in_new</mat-icon>
          </a>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Destructive actions</div>
        <p class="preview-section__note">
          Use an outlined warn button and confirm with a dialog. Keep it lower
          emphasis than the primary action. Our primary and warn colors are
          both red, so a filled delete looks just like a normal button; the
          outline and the dialog are what keep it safe.
        </p>
        <preview-do-dont
          doCaption="Outlined warn, lower emphasis, and it opens a confirm dialog."
          dontCaption="A filled button looks like the primary action and is easy to hit by accident."
        >
          <button
            slot="do"
            mat-stroked-button
            color="warn"
            (click)="confirmDelete()"
          >
            Delete project
          </button>
          <button slot="dont" mat-flat-button color="primary">
            Delete project
          </button>
        </preview-do-dont>
        @if (deleted() !== null) {
          <p class="btn-result">
            Dialog returned: {{ deleted() ? "confirmed" : "cancelled" }}
          </p>
        }
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">Async and legacy</div>
        <p class="preview-section__note">
          For anything that hits the server, use gt-loading-button (see Loading
          button): it shows a spinner and blocks double-submits. Do not use
          mat-raised-button, the old Material 2 elevated style.
        </p>
      </div>
    </preview-doc>
  `,
})
export class ButtonsPreview {
  private readonly dialog = inject(MatDialog);
  readonly deleted = signal<boolean | null>(null);

  readonly whenToUse = [
    "Any action a person takes: save, add, delete, navigate",
    "Choosing between primary, secondary, and low-emphasis actions",
  ];
  readonly dos = [
    "Use one filled button per view, for the primary action",
    "Use outlined for the secondary action next to it",
    "Keep cancel, close, and dismiss as text buttons",
    "Leave a secondary outlined button uncolored: primary and warn are both red, so a color on an outline reads as destructive",
    "Put the icon before the label",
    "Style destructive actions as an outlined warn button plus a confirm dialog",
    "Use the two standard icon-button sizes, not ad-hoc ones",
  ];
  readonly donts = [
    "Put two filled buttons in competition on one view",
    "Make a delete a filled button that competes with the primary action",
    "Use mat-raised-button (Material 2)",
    "Invent per-page icon-button sizes",
  ];
  readonly content = [
    "Use a verb, and name the object when it adds clarity: Add Monitor, not just Add",
    "A bare verb is fine only when the object is obvious from right beside it",
    "Match a confirm button to its action: Delete, not Confirm or Yes",
    "Keep it short: a verb, or a verb plus its object",
  ];
  readonly api: ApiRow[] = [
    { name: "mat-flat-button", type: "Material, filled", default: "", description: "Primary action, one per view" },
    { name: "mat-stroked-button", type: "Material, outlined", default: "", description: "Secondary action" },
    { name: "mat-button", type: "Material, text", default: "", description: "Low-emphasis action" },
    { name: "mat-icon-button", type: "Material, icon", default: "", description: "Compact action; needs aria-label" },
    { name: "gt-loading-button", type: "our async wrapper", default: "flat", description: "Server actions; shows a spinner" },
    { name: `color`, type: `"primary" | "warn"`, default: "", description: "primary for key actions, warn for destructive" },
  ];
  readonly code = `<!-- primary + cancel -->
<button mat-flat-button color="primary" (click)="save()">Save</button>
<button mat-button (click)="cancel()">Cancel</button>

<!-- destructive: outlined warn, lower emphasis, always confirmed -->
<button mat-stroked-button color="warn" (click)="confirmDelete()">
  Delete project
</button>

<!-- icon, always labelled -->
<button mat-icon-button aria-label="Settings">
  <mat-icon>settings</mat-icon>
</button>`;

  confirmDelete(): void {
    const data: DemoConfirmData = {
      title: "Delete project?",
      message: "frontend and all of its events will be permanently deleted.",
      confirmText: "Delete",
    };
    this.dialog
      .open(DemoConfirmDialog, { data })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) =>
        this.deleted.set(!!confirmed),
      );
  }
}
