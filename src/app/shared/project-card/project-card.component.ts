import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
} from "@angular/core";
import type {
  ProjectCardButtonWithQuery,
  ProjectCardButton,
} from "../shared.interfaces";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  standalone: true,
  selector: "gt-project-card",
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: "./project-card.component.html",
  styleUrls: ["./project-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  @Input() cardLink?: string | unknown[];
  @Input() cardLinkQueryParams?: { [k: string]: unknown };
  @Input() title?: string;
  @Input() descriptionList?: { key: string; value: string }[];
  @Input() isMember?: boolean;

  @Input() primaryButton?: ProjectCardButtonWithQuery;
  @Input() secondaryButton?: ProjectCardButton;

  @Input() sampleCard = false;

  @HostBinding("class.sample-card") get isSampleCard() {
    return this.sampleCard;
  }
}
