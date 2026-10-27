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
      .ss-list {
        margin: 0;
        padding: 0;
        list-style: none;
        font: var(--mat-sys-body-medium);
      }
      .ss-list li + li {
        margin-top: var(--gt-space-2, 8px);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Settings section"
      status="stable"
      description="One setting on a settings page: a title, an optional line of help, then the control and its action. Sections stack in a single column with a hairline between them, with no cards."
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
        <div class="preview-section__title">A settings page</div>
        <p class="preview-section__note">
          Inline name, an add field joined to its list, a read-only value, then
          the destructive action last. Only the sections whose description adds
          something have one.
        </p>
        <div>
          <gt-settings-section #name title="Name" [inline]="true">
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <input
                matInput
                value="storefront-web"
                [attr.aria-labelledby]="name.titleId"
              />
            </mat-form-field>
            <button slot="actions" mat-stroked-button>Save name</button>
          </gt-settings-section>
          <gt-settings-section #addEnv title="Add environment" [inline]="true">
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <input matInput [attr.aria-labelledby]="addEnv.titleId" />
            </mat-form-field>
            <button slot="actions" mat-stroked-button>Add environment</button>
          </gt-settings-section>
          <gt-settings-section
            class="gt-settings-continued"
            title="Environments"
          >
            <ul class="ss-list">
              <li>production</li>
              <li>staging</li>
            </ul>
          </gt-settings-section>
          <gt-settings-section title="Platform">
            <span slot="description"
              >Picks the setup guide and icon for this project.</span
            >
            <span class="body-text">JavaScript</span>
          </gt-settings-section>
          <gt-settings-section title="Delete project">
            <span slot="description"
              >Deletes <strong>storefront-web</strong> and all of its issues,
              events and settings. This cannot be undone.</span
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
    "Stack sections in one column; a hairline between them separates them",
    "Put the field that adds to a list above the list, joined with .gt-settings-continued on the list",
    "Use inline for a single control with its action beside it",
    "Put the action below, left-aligned, when a section has several controls or none",
    "Save a choice that previews itself, such as the theme, on change with no button",
    "Give each section its own outlined Save that names what it saves: Save name",
    "Put a destructive action in the last section, as an outlined warn button that opens a confirm dialog",
    "Show a failed delete with gt-form-error inside its delete section, not a toast",
    "Put a section's server error in its error slot, just above the action",
    "Name the object in bold in a delete section's description",
    "Show the value as plain text when the person cannot edit it",
    "Give a section a description only when it says something the title and control do not: a consequence, a limit, non-obvious behaviour",
  ];
  readonly donts = [
    "Wrap sections in cards",
    "Put a list and the field that adds to it in one section; make them two, joined",
    "Repeat the title as the label of a section's only field",
    "Write a description that restates the title or the control; omit it instead",
    "Use a filled Save; settings pages have no primary action",
    "Box the danger section in red; the warn button and the dialog carry the warning",
  ];
  readonly content = [
    "Title: the setting's name, in sentence case: Name, Delete project",
    "Description: optional, one line on a consequence, a limit or non-obvious behaviour",
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
      description:
        "Optional. One line the title and control do not already say; may contain a link",
    },
    {
      name: '[slot="error"]',
      type: "projected",
      default: "",
      description:
        "A gt-form-error just above the actions; inline, a line above the field",
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
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <input matInput formControlName="name" [attr.aria-labelledby]="name.titleId" />
    </mat-form-field>
    <gt-loading-button slot="actions" buttonText="Save name" buttonStyle="stroked" />
  </gt-settings-section>
</form>`;
}
