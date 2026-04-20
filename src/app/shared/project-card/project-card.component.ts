import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  input,
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
import { MatDividerModule } from "@angular/material/divider";
import { UpperCasePipe } from "@angular/common";

@Component({
  selector: "gt-project-card",
  imports: [
    UpperCasePipe,
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
  readonly cardLink = input<string | unknown[]>();
  readonly cardLinkQueryParams = input<{
    [k: string]: unknown;
  }>();
  readonly title = input<string>();
  readonly descriptionList = input<
    {
      key: string;
      value: string;
    }[]
  >();
  readonly isMember = input<boolean>();

  @Input() primaryButton?: ProjectCardButtonWithQuery;
  @Input() secondaryButton?: ProjectCardButton;

  readonly sampleCard = input(false);

  @HostBinding("class.sample-card") get isSampleCard() {
    return this.sampleCard();
  }
}
