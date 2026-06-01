import { Component, PLATFORM_ID, inject } from "@angular/core";
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
import { RouterLink } from "@angular/router";

const SUPPORT_EMAIL = "sales@glitchtip.com";
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
  styleUrls: ["./support.component.scss"],
})
export class SupportComponent {
  private platformId = inject(PLATFORM_ID);
  protected appUrl = APP_URL;

  protected contactForm = new FormGroup({
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    licenseKey: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(LICENSE_KEY_PATTERN)],
    }),
    message: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Deep links from the in-app Support menu pass both fields via the
      // URL fragment (fragments stay client-side and aren't logged by servers).
      // Format: #sub=sub_xxx&email=foo@bar.com
      // Bare #sub_xxx is also accepted for manual/test convenience.
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const sub = params.get("sub") ?? (LICENSE_KEY_PATTERN.test(hash) ? hash : null);
      const email = params.get("email");
      if (sub && LICENSE_KEY_PATTERN.test(sub)) {
        this.contactForm.controls.licenseKey.setValue(sub);
      }
      if (email) {
        this.contactForm.controls.email.setValue(email);
      }
    }
  }

  composeSupportEmail() {
    if (this.contactForm.invalid) return;
    const { email, licenseKey, message } = this.contactForm.value;
    const subject = `Support Request - ${licenseKey}`;
    const body = [
      message,
      "",
      "--",
      `From: ${email}`,
      `License key: ${licenseKey}`,
    ].join("\n");
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }
}
