import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  input,
  inject,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { client } from "src/app/shared/api/api";

@Component({
  template: `<div i18n>Confirming email…</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent implements OnInit {
  #router = inject(Router);
  #snackBar = inject(MatSnackBar);
  key = input.required<string>();

  async ngOnInit() {
    const { error } = await client.POST(
      "/_allauth/browser/v1/auth/email/verify",
      {
        body: { key: this.key() },
      },
    );
    if (error) {
      this.#snackBar.open($localize`
          This e-mail confirmation link expired or is invalid. Please
          issue a new e-mail confirmation request.
      `);
    } else {
      this.#snackBar.open($localize`Your email address has been confirmed.`);
    }
    this.#router.navigate(["profile"]);
  }
}
