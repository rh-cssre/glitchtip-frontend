import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "app-project-card",
  templateUrl: "./project-card.component.html",
  styleUrls: ["./project-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  @Input() cardLink: string;
  @Input() cardLinkQueryParams?: string;
  @Input() title: string;
  @Input() descriptionList: [{ key: string; value: string }];

  @Input() primaryActionButtonLink: string;
  @Input() primaryActionButtonQuery?: string;
  @Input() primaryActionButtonIcon?: string;
  @Input() primaryActionButtonText: string;

  @Input() secondaryActionButtonLink: string;
  @Input() secondaryActionButtonIcon?: string;
  @Input() secondaryActionButtonText: string;
}
