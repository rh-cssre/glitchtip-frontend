import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewChild,
} from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SettingsService } from "src/app/api/settings.service";
import { client } from "src/app/shared/api/api";
import { SupportChatService } from "src/app/shared/support-chat.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "gt-support-menu",
  templateUrl: "./support-menu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
})
export class SupportMenuComponent {
  @ViewChild("supportMenu") menu!: MatMenu;

  private settings = inject(SettingsService);
  private snackBar = inject(MatSnackBar);
  protected supportChat = inject(SupportChatService);

  protected paidForGlitchTip = this.settings.paidForGlitchTip;
  protected billingEnabled = this.settings.billingEnabled;
  protected supportUrl = signal<string | null>(null);
  // Fallback when no license-prefilled link is available — still routes to the support page.
  protected readonly fallbackSupportUrl = "https://glitchtip.com/support";

  // Keep the menu open while the chat loads, so the click shows progress.
  async openChat(event: Event) {
    event.stopPropagation();
    if (this.supportChat.opening()) return;
    const opened = await this.supportChat.open();
    this.menu.closed.emit("click");
    if (!opened) {
      // Offer email rather than launching a mail client long after the click.
      const email = environment.billingEmail;
      this.snackBar
        .open($localize`Support chat couldn't load. Email ${email}.`, $localize`Email`)
        .onAction()
        .subscribe(() => (window.location.href = `mailto:${email}`));
    }
  }

  // Resolved on menu open so the link is a plain anchor (avoids popup-blocked window.open).
  async loadSupportLink() {
    if (this.supportUrl()) return;
    const { data } = await client.GET("/api/0/instance-license/support-link/");
    if (data?.url) {
      this.supportUrl.set(data.url);
    }
  }
}
