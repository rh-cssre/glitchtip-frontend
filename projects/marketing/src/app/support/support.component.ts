import {
  Component,
  PLATFORM_ID,
  inject,
  ChangeDetectionStrategy,
  signal,
  DestroyRef,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterLink, ActivatedRoute } from "@angular/router";

const SUPPORT_EMAIL = "support@glitchtip.com";
const LICENSE_KEY_PATTERN = /^sub_[A-Za-z0-9]+$/;
const APP_URL = "https://app.glitchtip.com";

@Component({
  selector: "mkt-support",
  imports: [
    MatCard,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: "./support.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./support.component.scss"],
})
export class SupportComponent {
  private platformId = inject(PLATFORM_ID);
  protected appUrl = APP_URL;
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  // Chatwoot loads from a third-party script that can silently fail (ad
  // blockers, CSP, outage). Only show "Talk to us" once the SDK is ready.
  protected chatwootReady = signal(false);

  protected contactForm = new FormGroup({
    licenseKey: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(LICENSE_KEY_PATTERN),
      ],
    }),
  });

  constructor() {
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
       // Already initialized, or wait for the SDK's "chatwoot:ready" event.
      if (window.$chatwoot) {
        this.chatwootReady.set(true);
      } else {
        const onReady = () => this.chatwootReady.set(true);
        window.addEventListener("chatwoot:ready", onReady, { once: true });
        this.destroyRef.onDestroy(() =>
          window.removeEventListener("chatwoot:ready", onReady),
        );
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

  handleChatwoot() {
    if (this.contactForm.invalid) return;
    const { licenseKey } = this.contactForm.value;
    // Guard in case the SDK vanished between render and click.
    if (!window.$chatwoot) return;
    window.$chatwoot.toggle("open");
    window.$chatwoot.setConversationCustomAttributes({
      license: licenseKey,
    });
  }
}
