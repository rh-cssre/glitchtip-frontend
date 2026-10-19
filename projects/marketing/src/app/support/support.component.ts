import {
  Component,
  PLATFORM_ID,
  inject,
  ChangeDetectionStrategy,
  signal,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { PageShellComponent } from "../shared/page-shell/page-shell.component";
import { SectionHeaderComponent } from "../shared/section-header/section-header.component";
import { RevealDirective } from "../shared/reveal.directive";
import { LinksService } from "../links.service";
import { SeoService } from "../shared/seo.service";
import { SupportChatService } from "../shared/support-chat.service";

const SUPPORT_EMAIL = "support@glitchtip.com";
const LICENSE_KEY_PATTERN = /^sub_[A-Za-z0-9]+$/;

/** A self-serve or community channel shown in the "How can we help?" grid. */
interface SupportChannel {
  title: string;
  description: string;
  icon: string;
  /** An in-app router path (stays in the SPA). */
  link?: string;
  /** An external URL (opens in a new tab). */
  href?: string;
}

const SUPPORT_CHANNELS: SupportChannel[] = [
  {
    title: "Documentation",
    description: "Setup guides and how-tos for every feature.",
    icon: "text_snippet",
    link: "/documentation",
  },
  {
    title: "FAQ",
    description: "Quick answers to the questions we hear most.",
    icon: "info",
    link: "/documentation/frequently-asked-questions",
  },
  {
    title: "Issue tracker",
    description: "Report a bug or request a feature on GitLab.",
    icon: "code",
    href: "https://gitlab.com/glitchtip",
  },
];

@Component({
  selector: "mkt-support",
  imports: [
    PageShellComponent,
    SectionHeaderComponent,
    RevealDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: "./support.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./support.component.scss"],
})
export class SupportComponent {
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private links = inject(LinksService);
  private seo = inject(SeoService);
  protected supportChat = inject(SupportChatService);
  protected chatFailed = signal(false);
  protected readonly supportEmail = SUPPORT_EMAIL;

  protected readonly channels = SUPPORT_CHANNELS;
  protected readonly loginLink = this.links.loginLink;
  protected readonly registerLink = this.links.registerLink;

  // The license key is optional: anyone can reach the team, and a key just adds
  // priority for active support-plan holders. Only the shape is validated.
  protected contactForm = new FormGroup({
    licenseKey: new FormControl("", {
      nonNullable: true,
      validators: [Validators.pattern(LICENSE_KEY_PATTERN)],
    }),
  });

  constructor() {
    this.seo.setPageSeo({
      title: "Support",
      description:
        "Get help with GlitchTip: read the docs, ask the community, or reach our team.",
    });

    if (isPlatformBrowser(this.platformId)) {
      // Deep links from the in-app Support menu pass license code via the
      // URL fragment (fragments stay client-side and aren't logged by servers).
      // Similarly, they may also come as query params.
      // Format: #sub=sub_xxx OR ?sub=sub_xxx
      // Bare #sub_xxx is also accepted for manual/test convenience.
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const sub =
        this.route.snapshot.queryParamMap.get("sub") ??
        params.get("sub") ??
        (LICENSE_KEY_PATTERN.test(hash) ? hash : null);

      if (sub && LICENSE_KEY_PATTERN.test(sub)) {
        this.contactForm.controls.licenseKey.setValue(sub);
      }
    }
  }

  composeSupportEmail() {
    if (this.contactForm.invalid) return;
    const { licenseKey } = this.contactForm.value;
    const subject = `Support Request - ${licenseKey}`;
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailto;
  }

  async handleChatwoot() {
    if (this.contactForm.invalid || this.supportChat.opening()) return;
    const { licenseKey } = this.contactForm.value;
    // The chat script loads on first click. If it can't (ad blocker, outage),
    // point to email rather than opening a mail client long after the click.
    const opened = await this.supportChat.open();
    this.chatFailed.set(!opened);
    if (!opened) return;
    window.$chatwoot?.setConversationCustomAttributes({
      license: licenseKey,
    });
  }
}
