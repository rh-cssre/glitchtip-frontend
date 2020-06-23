import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() cardLink: string | any[];
  @Input() cardLinkQueryParams?: { [k: string]: any };
  @Input() title?: string;
  @Input() secondaryButton = true;
}
