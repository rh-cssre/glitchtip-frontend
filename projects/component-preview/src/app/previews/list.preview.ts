import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-list",
  imports: [
    ListComponent,
    ListRowComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <preview-doc
      title="List"
      status="stable"
      description="A collection of records, one per row: the name, an optional muted fact, and its actions at the end. An optional description line sits under the name. The rows sit in a bordered container, like a table."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="gt-list is a list and each gt-list-row a list item. A row's menu button names whose actions it opens: Actions for maya@acme.com."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">One action per row</div>
        <gt-list>
          <gt-list-row>
            maya.chen&#64;acme.com
            <span slot="meta">Owner</span>
            <button slot="actions" mat-stroked-button>Remove</button>
          </gt-list-row>
          <gt-list-row>
            sam.ortiz&#64;acme.com
            <span slot="meta">Member</span>
            <button slot="actions" mat-stroked-button>Remove</button>
          </gt-list-row>
        </gt-list>
      </div>

      <div class="preview-section">
        <div class="preview-section__title"> Two or more actions: a menu </div>
        <gt-list>
          <gt-list-row>
            new.hire&#64;acme.com
            <span slot="meta">Member</span>
            <ng-container slot="actions">
              <button
                mat-icon-button
                class="medium-icon-button"
                [matMenuTriggerFor]="menu"
                aria-label="Actions for new.hire@acme.com"
              >
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu" xPosition="before">
                <button mat-menu-item>Resend invite</button>
                <button mat-menu-item>Remove</button>
              </mat-menu>
            </ng-container>
          </gt-list-row>
        </gt-list>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">With a group label</div>
        <gt-list label="Visible">
          <gt-list-row>
            production
            <button slot="actions" mat-stroked-button>Hide</button>
          </gt-list-row>
          <gt-list-row>
            staging
            <button slot="actions" mat-stroked-button>Hide</button>
          </gt-list-row>
        </gt-list>
      </div>
    </preview-doc>
  `,
})
export class ListPreview {
  readonly whenToUse = [
    "A list of records with a name and a few actions: members, teams, environments, tokens",
    "Use a table instead when rows have several columns to compare or sort",
  ];
  readonly dos = [
    "Give a row with one action a visible outlined button",
    "Put two or more actions in a menu at the end of the row",
    "Keep row actions neutral; the confirm dialog carries the warning for a destructive one",
    "Keep action labels short (Remove, Hide) so the action column lines up",
  ];
  readonly donts = [
    "Use a menu for a single action; it adds a step for nothing",
    "Color row buttons warn; a column of red buttons stops meaning anything",
    "Wrap the list in a card with a title bar",
  ];
  readonly api: ApiRow[] = [
    {
      name: "gt-list label",
      type: "string | null",
      default: "null",
      description: "Optional group label above the rows",
    },
    {
      name: "gt-list-row content",
      type: "projected",
      default: "",
      description: "The record's name, plus any tags",
    },
    {
      name: '[slot="description"]',
      type: "projected",
      default: "",
      description: "An optional muted line under the name",
    },
    {
      name: '[slot="meta"]',
      type: "projected",
      default: "",
      description: "One muted fact, such as a role",
    },
    {
      name: '[slot="actions"]',
      type: "projected",
      default: "",
      description: "A button, or a menu for two or more actions",
    },
  ];
  readonly importCode = `import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";`;
  readonly code = `<gt-list>
  @for (member of members(); track member.id) {
    <gt-list-row>
      {{ member.email }}
      <span slot="meta">{{ member.roleName }}</span>
      <gt-loading-button slot="actions" buttonText="Remove" buttonStyle="stroked" />
    </gt-list-row>
  }
</gt-list>`;
}
