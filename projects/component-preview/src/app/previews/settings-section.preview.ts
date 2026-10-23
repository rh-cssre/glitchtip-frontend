import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-settings-section",
  imports: [
    SettingsSectionComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .ss-surface {
        padding: var(--gt-space-5) var(--gt-space-5) 0;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        background: var(--mat-sys-surface);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Settings section"
      status="stable"
      description="One setting on a settings page: a title, one line of help, then the control and its action. Sections stack in a single column, separated by space, with no cards or dividers."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="The title is an h2 under the page's h1. When a section holds a single field, link the input to the title with aria-labelledby so the visible title is its label."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">
          Inline: one control with its action
        </div>
        <div class="ss-surface">
          <gt-settings-section #name title="Name" [inline]="true">
            <span slot="description"
              >Shown in issue lists, alerts and the project switcher.</span
            >
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <input
                matInput
                value="storefront-web"
                [attr.aria-labelledby]="name.titleId"
              />
            </mat-form-field>
            <button slot="actions" mat-stroked-button>Save name</button>
          </gt-settings-section>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">
          Stacked: several fields, action below
        </div>
        <div class="ss-surface">
          <gt-settings-section title="Change password">
            <span slot="description"
              >Use at least eight characters. You stay signed in on this
              device.</span
            >
            <mat-form-field appearance="outline">
              <mat-label>Current password</mat-label>
              <input matInput type="password" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>New password</mat-label>
              <input matInput type="password" />
            </mat-form-field>
            <button slot="actions" mat-stroked-button>Change password</button>
          </gt-settings-section>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">A destructive action</div>
        <div class="ss-surface">
          <gt-settings-section title="Delete project">
            <span slot="description"
              >Deletes storefront-web and all of its issues, events and
              settings. This cannot be undone.</span
            >
            <button slot="actions" mat-stroked-button color="warn">
              Delete project
            </button>
          </gt-settings-section>
        </div>
      </div>
    </preview-doc>
  `,
})
export class SettingsSectionPreview {
  readonly whenToUse = [
    "Each setting on a project, team, organization or profile settings page",
  ];
  readonly dos = [
    "Stack sections in one column and let the space between them separate them",
    "Use inline for a single control with its action beside it",
    "Give each section its own outlined Save that names what it saves: Save name",
    "Put a destructive action in the last section, as an outlined warn button that opens a confirm dialog",
    "Show the value as plain text when the person cannot edit it",
  ];
  readonly donts = [
    "Wrap sections in cards or draw dividers between them",
    "Repeat the title as the label of a section's only field",
    "Use a filled Save; settings pages have no primary action",
    "Box the danger section in red; the warn button and the dialog carry the warning",
  ];
  readonly content = [
    "Title: the setting's name, in sentence case: Name, Delete project",
    "Description: one line on what the setting does",
  ];
  readonly api: ApiRow[] = [
    {
      name: "title",
      type: "string",
      default: "",
      description: "The setting's name (required)",
    },
    {
      name: "inline",
      type: "boolean",
      default: "false",
      description: "Puts the actions beside a single control",
    },
    {
      name: "titleId",
      type: "string",
      default: "generated",
      description: "Id of the title, for aria-labelledby on a lone field",
    },
    {
      name: '[slot="description"]',
      type: "projected",
      default: "",
      description: "One line of help; may contain a link",
    },
    {
      name: '[slot="actions"]',
      type: "projected",
      default: "",
      description: "The section's buttons",
    },
  ];
  readonly importCode = `import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";`;
  readonly code = `<form [formGroup]="nameForm" (ngSubmit)="updateName()">
  <gt-settings-section #name title="Name" [inline]="true">
    <span slot="description">Shown in issue lists and alerts.</span>
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <input matInput formControlName="name" [attr.aria-labelledby]="name.titleId" />
    </mat-form-field>
    <gt-loading-button slot="actions" buttonText="Save name" buttonStyle="stroked" />
  </gt-settings-section>
</form>`;
}
