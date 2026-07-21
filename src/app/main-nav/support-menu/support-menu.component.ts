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
import { SettingsService } from "src/app/api/settings.service";
import { client } from "src/app/shared/api/api";

@Component({
  selector: "gt-support-menu",
  templateUrl: "./support-menu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDividerModule, MatIconModule, MatMenuModule],
})
export class SupportMenuComponent {
  @ViewChild("supportMenu") menu!: MatMenu;

  private settings = inject(SettingsService);

  protected paidForGlitchTip = this.settings.paidForGlitchTip;
  protected billingEnabled = this.settings.billingEnabled;
  protected supportUrl = signal<string | null>(null);
  // Fallback when no license-prefilled link is available — still routes to the support page.
  protected readonly fallbackSupportUrl = "https://glitchtip.com/support";

  // Resolved on menu open so the link is a plain anchor (avoids popup-blocked window.open).
  async loadSupportLink() {
    if (this.supportUrl()) return;
    const { data } = await client.GET("/api/0/instance-license/support-link/");
    if (data?.url) {
      this.supportUrl.set(data.url);
    }
  }
}
