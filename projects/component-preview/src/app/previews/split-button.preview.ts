import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { SplitButtonComponent } from "src/app/shared/split-button/split-button.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-split-button",
  imports: [
    SplitButtonComponent,
    MatMenuModule,
    PanelComponent,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .sb-text {
        margin: 0;
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Split button"
      status="stable"
      description="One outlined 32px shape with a main action and a caret that opens related actions, split by a full-height hairline. In a bar or panel under 600px the main part keeps only its icon."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The host is a group named by the label. The caret is a menu button named by menuLabel, so it announces its popup and expanded state. The main part is named and tooltipped by the label, so it stays named when only the icon shows."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">In a panel header</div>
        <gt-panel title="Event">
          <gt-split-button
            slot="actions"
            icon="content_copy"
            label="Copy for AI"
            menuLabel="More copy options"
            [menu]="menu"
            (action)="last.set('Copy for AI')"
          />
          <p class="sb-text">Last action: {{ last() || "none" }}</p>
        </gt-panel>
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
    "Pick an icon that reads alone in a narrow bar",
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
      description:
        "Material symbol before the label; shown alone in a narrow bar (required)",
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
