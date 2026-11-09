import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { client } from "src/app/shared/api/api";

@Component({
  templateUrl: "./wizard.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Wizard implements OnInit {
  hash = input.required<string>();
  message = signal($localize`Connecting to @sentry/wizard…`);

  async ngOnInit() {
    const { error } = await client.POST("/api/0/wizard-set-token/", {
      body: { hash: this.hash() },
    });
    if (error) {
      this.message.set($localize`Unable to connect to @sentry/wizard`);
    } else {
      this.message.set($localize`Successfully connected to @sentry/wizard.`);
    }
  }
}
