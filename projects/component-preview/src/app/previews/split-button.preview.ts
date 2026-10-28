import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { SplitButtonComponent } from "src/app/shared/split-button/split-button.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-split-button",
  imports: [SplitButtonComponent, MatMenuModule, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .sb-row {
        display: flex;
        align-items: center;
        gap: var(--gt-space-3, 12px);
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Split button"
      status="stable"
      description="One outlined 32px shape with a main action and a caret that opens related actions, split by a full-height hairline. Under 600px the main part keeps only its icon."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The host is a group named by the label. The caret is a menu button named by menuLabel, so it announces its popup and expanded state. When only the icon shows, the label is its accessible name and tooltip."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Copy with more options</div>
        <div class="sb-row">
          <gt-split-button
            icon="content_copy"
            label="Copy for AI"
            menuLabel="More copy options"
            [menu]="menu"
            (action)="last.set('Copy for AI')"
          />
          <span>{{ last() }}</span>
        </div>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="last.set('Copy event link')">
            Copy event link
          </button>
          <button mat-menu-item (click)="last.set('Copy event ID')">
            Copy event ID
          </button>
        </mat-menu>
      </div>
    </preview-doc>
  `,
})
export class SplitButtonPreview {
  readonly last = signal("");

  readonly whenToUse = [
    "An action on the record with a few variants, such as Copy for AI with Copy event ID",
  ];
  readonly dos = [
    "Make the main part the most common variant",
    "Name the caret for what its menu holds",
    "Give the main part an icon so it still reads on mobile",
  ];
  readonly donts = [
    "Use it for a single action; use an outlined button",
    "Put view switches in its menu; use a ghost select",
    "Make it filled or red",
  ];
  readonly api: ApiRow[] = [
    {
      name: "label",
      type: "string",
      description: "Main action text and the group's name (required)",
    },
    {
      name: "icon",
      type: "string",
      default: '""',
      description:
        "Material symbol before the label; the only content under 600px",
    },
    {
      name: "menuLabel",
      type: "string",
      description: "Caret accessible name and tooltip (required)",
    },
    {
      name: "menu",
      type: "MatMenuPanel",
      description: "The mat-menu the caret opens (required)",
    },
    {
      name: "(action)",
      type: "void",
      description: "Main part clicked",
    },
  ];
  readonly importCode = `import { SplitButtonComponent } from "src/app/shared/split-button/split-button.component";`;
  readonly code = `<gt-split-button
  icon="content_copy"
  i18n-label
  label="Copy for AI"
  i18n-menuLabel
  menuLabel="More copy options"
  [menu]="copyMenu"
  (action)="copyForAI()"
/>
<mat-menu #copyMenu="matMenu">
  <button mat-menu-item i18n>Copy event ID</button>
</mat-menu>`;
}
