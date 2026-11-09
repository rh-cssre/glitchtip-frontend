import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";
import { EmailsService } from "src/app/api/emails/emails.service";

@Component({
  selector: "gt-verify-email-banner",
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: "./verify-email-banner.component.html",
  styleUrls: ["./verify-email-banner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailBannerComponent {
  readonly emailsService = inject(EmailsService);

  onResend() {
    const email = this.emailsService.primaryEmail();
    if (email) this.emailsService.resendConfirmation(email);
  }

  onRefresh() {
    this.emailsService.refresh();
  }
}
