import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { components } from "src/app/api/api-schema";
import { recipientLabel } from "../alert-labels";
import { RecipientIconComponent } from "../recipient-icon/recipient-icon.component";

type AlertRecipient = components["schemas"]["AlertRecipientSchema"];

/** An alert's recipients as icons, with who gets notified in each tooltip. */
@Component({
  selector: "gt-alert-recipients",
  templateUrl: "./alert-recipients.component.html",
  styleUrls: ["./alert-recipients.component.scss"],
  imports: [MatTooltipModule, RecipientIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertRecipientsComponent {
  recipients = input.required<AlertRecipient[]>();
  /** The project's team slugs, for the email tooltip. */
  teams = input<string[]>();

  recipientLabel = recipientLabel;
}
