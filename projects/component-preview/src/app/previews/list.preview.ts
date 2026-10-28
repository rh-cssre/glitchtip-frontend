import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { ListRowLinkComponent } from "src/app/shared/list/list-row-link.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-list",
  imports: [
    ListComponent,
    ListRowComponent,
    ListRowLinkComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .preview-list-create {
      margin-bottom: var(--gt-space-4, 16px);
    }
  `,
  template: `
    <preview-doc
      title="List"
      status="stable"
      description="A collection of records, one per row: the name, optional muted facts, and its actions at the end. An optional description line sits under the name. The rows sit in a bordered container, like a table."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="gt-list is a list and each gt-list-row a list item. A row's menu button names whose actions it opens: Actions for maya@acme.com. A navigable row has one tab stop, its name link; the chevron is hidden from screen readers."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">One action per row</div>
        <gt-list>
          <gt-list-row>
            maya.chen&#64;acme.com
            <span class="list-row__tag">Account owner</span>
            <span slot="description"
              >Account ownership must be transferred.</span
            >
            <span slot="meta">Owner</span>
            <button slot="actions" mat-stroked-button disabled>Remove</button>
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
        <div class="preview-section__title">Several facts</div>
        <gt-list>
          <gt-list-row>
            #backend
            <span slot="meta">
              <span>4 members</span>
              <span>2 projects</span>
            </span>
            <button slot="actions" mat-stroked-button>Leave</button>
          </gt-list-row>
        </gt-list>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">
          Inside a record's tab, rows that open their record
        </div>
        <button mat-stroked-button class="preview-list-create">
          <mat-icon>add</mat-icon>
          New alert
        </button>
        <gt-list>
          <gt-list-row>
            <a gtListRowLink href="#" (click)="$event.preventDefault()"
              >Error spike</a
            >
            <span slot="description"
              >Alerts when an issue gets 10 events in 1 minute.</span
            >
          </gt-list-row>
          <gt-list-row>
            <a gtListRowLink href="#" (click)="$event.preventDefault()"
              >Checkout down</a
            >
            <span slot="description"
              >Alerts when an uptime monitor goes down.</span
            >
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
    "Make the name the link when a row opens its record, with gtListRowLink: the whole row becomes the target and a chevron marks it",
    "Give a row with one action a visible outlined button",
    "Put two or more actions in a menu at the end of the row",
    "Keep row actions neutral; the confirm dialog carries the warning for a destructive one",
    "Keep action labels short (Remove, Hide) so the action column lines up",
    "Mark a fixed attribute (Owner, Primary) with .list-row__tag after the name",
    "Say why a blocked action is blocked in the description line",
    "Give each meta fact its own span and let the row draw the separators",
    "Put a tab's create action above its list as an outlined button with the add icon",
  ];
  readonly donts = [
    "Use a menu for a single action; it adds a step for nothing",
    "Add an Edit button that repeats the name's link",
    "Color row buttons warn; a column of red buttons stops meaning anything",
    "Wrap the list in a card with a title bar",
    "Explain a disabled action only in a tooltip",
    'Type a separator such as "·" into a translated string',
    "Use an interactive chip for a label that does nothing when clicked",
  ];
  readonly api: ApiRow[] = [
    {
      name: "gt-list label",
      type: "string | null",
      default: "null",
      description: "Optional group label above the rows",
    },
    {
      name: "gt-list flush",
      type: "boolean",
      default: "false",
      description:
        "Drops the outer border, for rows that sit edge to edge in a flush panel",
    },
    {
      name: "gt-list-row content",
      type: "projected",
      default: "",
      description: "The record's name, plus any tags",
    },
    {
      name: ".list-row__tag",
      type: "class",
      default: "",
      description: "Neutral, non-interactive tag for a fixed attribute",
    },
    {
      name: "a[gtListRowLink]",
      type: "component",
      default: "",
      description:
        "Put it on the name link of a row that opens its record. The link covers the row, hover draws the state layer and underlines the name, focus rings the row, and the row adds a trailing chevron",
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
      description:
        "One or more muted facts. Give each fact its own span; the component adds the separators",
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
