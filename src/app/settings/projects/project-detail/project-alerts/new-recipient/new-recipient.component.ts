import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { RecipientType } from "src/app/api/projects/project-alerts/project-alerts.interface";
import { resolveRecipientIcon } from "../project-alerts.component";
import { urlRegex } from "src/app/shared/validators";
import { MatButtonModule } from "@angular/material/button";
import { LoadingButtonComponent } from "../../../../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  templateUrl: "./new-recipient.component.html",
  styleUrls: ["./new-recipient.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    LoadingButtonComponent,
    MatButtonModule,
  ],
})
export class NewRecipientComponent implements OnInit {
  dialogRef = inject<MatDialogRef<NewRecipientComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);

  recipientOptions = [
    { viewValue: "Email", value: "email" },
    { viewValue: "General (slack-compatible) Webhook", value: "webhook" },
    { viewValue: "Discord", value: "discord" },
    { viewValue: "Google Chat", value: "googlechat" },
    { viewValue: "ntfy", value: "ntfy" },
    { viewValue: "Microsoft Teams", value: "teams" },
    { viewValue: "Zulip", value: "zulip" },
  ];

  recipientForm = new FormGroup({
    recipientType: new FormControl("", [Validators.required]),
    url: new FormControl(""),
    botEmail: new FormControl(""),
    apiKey: new FormControl(""),
    channel: new FormControl(""),
    topic: new FormControl("GlitchTip Alerts"),
  });

  resolveIcon = resolveRecipientIcon;

  recipientType = this.recipientForm.get("recipientType") as FormControl;
  url = this.recipientForm.get("url") as FormControl;
  botEmail = this.recipientForm.get("botEmail") as FormControl;
  apiKey = this.recipientForm.get("apiKey") as FormControl;
  channel = this.recipientForm.get("channel") as FormControl;
  topic = this.recipientForm.get("topic") as FormControl;

  ngOnInit(): void {
    // Dynamically set validators based on recipient type
    this.recipientType.valueChanges.subscribe((type: RecipientType) => {
      this.url.clearValidators();
      this.botEmail.clearValidators();
      this.apiKey.clearValidators();
      this.channel.clearValidators();

      if (type === "webhook") {
        if (!this.data.editRecipient) this.url.setValue("https://");
        this.url.setValidators([
          Validators.required,
          Validators.pattern(urlRegex),
        ]);
      } else if (type === "email") {
        if (!this.data.editRecipient) this.url.setValue("");
      } else if (type === "discord") {
        if (!this.data.editRecipient) this.url.setValue("https://");
      } else if (type === "googlechat") {
        if (!this.data.editRecipient) this.url.setValue("https://chat.googleapis.com/v1/spaces/");
        this.url.setValidators([Validators.required]);
      } else if (type === "ntfy") {
        if (!this.data.editRecipient) this.url.setValue("https://ntfy.sh/");
        this.url.setValidators([Validators.required]);
      } else if (type === "teams") {
        if (!this.data.editRecipient) this.url.setValue("https://");
        this.url.setValidators([
          Validators.required,
          Validators.pattern(urlRegex),
        ]);
      } else if (type === "zulip") {
        if (!this.data.editRecipient) this.url.setValue("https://");
        this.url.setValidators([
          Validators.required,
          Validators.pattern(urlRegex),
        ]);
        this.botEmail.setValidators([Validators.required]);
        this.apiKey.setValidators([Validators.required]);
        this.channel.setValidators([Validators.required]);
      }
      this.url.updateValueAndValidity();
      this.botEmail.updateValueAndValidity();
      this.apiKey.updateValueAndValidity();
      this.channel.updateValueAndValidity();
    });

    // Pre-fill form when editing an existing recipient
    if (this.data.editRecipient) {
      const r = this.data.editRecipient;
      this.recipientType.setValue(r.recipientType);
      if (r.url) this.url.setValue(r.url);
      if (r.recipientType === "zulip") {
        // Saved recipients use config values; pre-save recipients use flat fields
        const cfg = r.config;
        this.botEmail.setValue(cfg ? cfg.bot_email : (r.botEmail || ""));
        this.apiKey.setValue(cfg ? cfg.api_key : (r.apiKey || ""));
        this.channel.setValue(cfg ? cfg.channel : (r.channel || ""));
        this.topic.setValue(cfg ? cfg.topic : (r.topic || "GlitchTip Alerts"));
      }
    }
  }

  selectOptions(
    recipientOptions: { viewValue: string; value: string }[],
    hideEmailOption?: boolean | null,
  ): { viewValue: string; value: string }[] {
    return hideEmailOption
      ? this.recipientOptions.filter((option) => option.value !== "email")
      : recipientOptions;
  }

  onSubmit() {
    if (this.recipientForm.valid) {
      const value: any = {
        recipientType: this.recipientType.value,
        url: this.url.value,
      };
      if (this.recipientType.value === "zulip") {
        value.botEmail = this.botEmail.value;
        value.apiKey = this.apiKey.value;
        value.channel = this.channel.value;
        value.topic = this.topic.value;
      }
      this.dialogRef.close(value);
    }
  }
}
