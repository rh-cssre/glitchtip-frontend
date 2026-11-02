import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ProjectCardComponent } from "src/app/shared/project-card/project-card.component";
import type {
  ProjectCardButton,
  ProjectCardButtonWithQuery,
} from "src/app/shared/shared.interfaces";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-project-card",
  imports: [ProjectCardComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .card-row {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: var(--gt-space-5);
        max-width: 640px;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Project card"
      status="legacy"
      description="A card summarizing a project with key/value details and up to two actions. Legacy: it still mixes decorator @Input()s with signal inputs and is slated for a conventions update."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The whole card is a router link for members; the action buttons remain separate, real links so they are individually focusable and announced."
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Member and non-member</div>
        <div class="card-row">
          <gt-project-card
            title="frontend"
            [cardLink]="['/']"
            [descriptionList]="details"
            [isMember]="true"
            [primaryButton]="primaryButton"
            [secondaryButton]="secondaryButton"
          />
          <gt-project-card
            title="backend"
            [descriptionList]="details"
            [isMember]="false"
            [secondaryButton]="secondaryButton"
          />
        </div>
      </div>
    </preview-doc>
  `,
})
export class ProjectCardPreview {
  readonly details = [
    { key: "Platform", value: "JavaScript" },
    { key: "Events (24h)", value: "1,204" },
  ];
  readonly primaryButton: ProjectCardButtonWithQuery = {
    link: ["/"],
    text: "View issues",
    icon: "search",
  };
  readonly secondaryButton: ProjectCardButton = {
    link: ["/"],
    text: "Settings",
    icon: "settings",
  };

  readonly whenToUse = [
    "Project overview grids (the projects page, org home)",
    "Any card that links to a detail view and offers one or two actions",
  ];
  readonly dos = [
    "Pass isMember so non-members get the join affordance instead of a dead link",
    "Keep descriptionList short; two or three key/value rows",
  ];
  readonly donts = [
    "Add more than two action buttons",
  ];
  readonly composition = {
    contains: ["Buttons & actions"],
  };
  readonly api: ApiRow[] = [
    { name: "title", type: "string", default: "", description: "Card heading" },
    { name: "cardLink", type: "string | unknown[]", default: "", description: "Router link for the whole card (members only)" },
    { name: "cardLinkQueryParams", type: "object", default: "", description: "Query params for the card link" },
    { name: "descriptionList", type: "{ key; value }[]", default: "", description: "Key/value rows shown in the card body" },
    { name: "isMember", type: "boolean", default: "", description: "Gates the card link and primary action" },
    { name: "primaryButton", type: "ProjectCardButtonWithQuery", default: "", description: "Primary action (legacy @Input)" },
    { name: "secondaryButton", type: "ProjectCardButton", default: "", description: "Secondary action (legacy @Input)" },
    { name: "sampleCard", type: "boolean", default: "false", description: "Renders the dashed sample-card treatment" },
  ];
  readonly importCode = `import { ProjectCardComponent } from "src/app/shared/project-card/project-card.component";`;
  readonly code = `<gt-project-card
  [title]="project.name"
  [cardLink]="['/', orgSlug, 'issues']"
  [descriptionList]="details"
  [isMember]="project.isMember"
  [primaryButton]="{ link: issuesLink, text: 'View issues' }"
/>`;
}
