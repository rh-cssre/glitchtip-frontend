import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "app-project-card",
  templateUrl: "./project-card.component.html",
  styleUrls: ["./project-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  @Input() cardLink: string | any[];
  @Input() cardLinkQueryParams?: { [k: string]: any };
  @Input() title: string;
  @Input() descriptionList: { key: string; value: string }[];

  @Input() primaryActionButtonLink: string | any[];
  @Input() primaryActionButtonQuery?: { [k: string]: any };
  @Input() primaryActionButtonIcon?: string;
  @Input() primaryActionButtonText: string;

  @Input() secondaryActionButtonLink: string | any[];
  @Input() secondaryActionButtonIcon?: string;
  @Input() secondaryActionButtonText: string;
}
