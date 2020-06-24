import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
} from "@angular/core";
import {
  ProjectCardButtonWithQuery,
  ProjectCardButton,
} from "../shared.interfaces";

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
  @Input() isMember: boolean;

  @Input() primaryButton: ProjectCardButtonWithQuery;
  @Input() secondaryButton: ProjectCardButton;

  @Input() sampleCard = false;

  @HostBinding("class.sample-card") get isSampleCard() {
    return this.sampleCard;
  }
}
