import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-settings-section",
  imports: [
    SettingsSectionComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <preview-doc
      title="Settings section"
      status="stable"
      description="One setting on a settings page: a title, an optional line of help, then the control and its action. With panel it is one bordered save unit, its action on the right of a tinted footer; panels stack 16px apart."
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
          One panel per save unit: a Save in the footer, a choice that saves on
          change with no footer, then the danger panel last.
        </p>
        <div>
          <gt-settings-section #name title="Name" panel>
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <input
                matInput
                value="storefront-web"
                [attr.aria-labelledby]="name.titleId"
              />
            </mat-form-field>
            <button slot="actions" mat-stroked-button>Save name</button>
          </gt-settings-section>
          <gt-settings-section #theme title="Theme" panel>
            <mat-button-toggle-group
              value="system"
              hideSingleSelectionIndicator
              [attr.aria-labelledby]="theme.titleId"
            >
              <mat-button-toggle value="light">Light</mat-button-toggle>
              <mat-button-toggle value="dark">Dark</mat-button-toggle>
              <mat-button-toggle value="system">System</mat-button-toggle>
            </mat-button-toggle-group>
          </gt-settings-section>
          <gt-settings-section title="Delete project" panel tone="danger">
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
    "Give each save unit its own panel, with its outlined Save in the footer: Save name",
    "Leave the footer out when the section saves on change, such as the theme",
    "Make a list its own flush panel with a flush gt-list, and put the field that adds to it in a panel above",
    "Put a list's New X entry button in the section's header-actions slot",
    "Put a destructive action last, as a danger panel with an outlined warn button and a confirm dialog",
    "Show a section's server error, such as a failed delete, with gt-form-error in its error slot, not a toast",
    "Name the object in bold in a delete section's description",
    "Show the value as plain text when the person cannot edit it",
    "Use hideTitle when the title only repeats the tab it sits in",
  ];
  readonly donts = [
    "Put two save units in one panel, or one save unit across two",
    "Draw a gt-list border inside a panel border; use flush on both",
    "Repeat the title as the label of a section's only field",
    "Use a filled Save; settings pages have no primary action",
    "Add a description that only restates the title or the control",
    "Leave an empty footer; a section without actions has none",
  ];
  readonly content = [
    "Title: the setting's name, in sentence case: Name, Delete project",
    "Description: only what the title and control do not say (a consequence, a limit, non-obvious behaviour); otherwise omit it",
  ];
  readonly api: ApiRow[] = [
    {
      name: "title",
      type: "string",
      default: "",
      description: "The setting's name (required)",
    },
    {
      name: "panel",
      type: "boolean",
      default: "false",
      description: "Renders the section as one gt-panel, actions in the footer",
    },
    {
      name: "tone",
      type: '"default" | "danger"',
      default: '"default"',
      description: "Danger tints the panel border, for Delete sections",
    },
    {
      name: "flush",
      type: "boolean",
      default: "false",
      description:
        "Panel body runs edge to edge under a hairline, for a flush gt-list",
    },
    {
      name: "hideTitle",
      type: "boolean",
      default: "false",
      description:
        "Hides a title that repeats the tab; screen readers still get it",
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
        "A gt-form-error at the bottom of the body, above the actions",
    },
    {
      name: '[slot="actions"]',
      type: "projected",
      default: "",
      description: "The section's buttons; in panel mode, the footer",
    },
    {
      name: '[slot="header-actions"]',
      type: "projected",
      default: "",
      description: "Panel only: a list's entry button, right of the title",
    },
  ];
  readonly importCode = `import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";`;
  readonly code = `<form [formGroup]="nameForm" (ngSubmit)="updateName()">
  <gt-settings-section #name title="Name" panel>
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <input matInput formControlName="name" [attr.aria-labelledby]="name.titleId" />
    </mat-form-field>
    <gt-loading-button slot="actions" buttonText="Save name" buttonStyle="stroked" />
  </gt-settings-section>
</form>`;
}
