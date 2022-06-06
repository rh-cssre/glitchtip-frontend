import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { RecipientType } from "src/app/api/projects/project-alerts/project-alerts.interface";
import { ProjectAlertsService } from "../project-alerts.service";
import { urlRegex } from "src/app/shared/validators";

@Component({
  selector: "gt-new-recipient",
  templateUrl: "./new-recipient.component.html",
  styleUrls: ["./new-recipient.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewRecipientComponent implements OnInit {
  recipientDialogOpen$ = this.alertsService.recipientDialogOpen$;
  emailSelected$ = this.alertsService.emailSelected$;
  recipientError$ = this.alertsService.recipientError$;

  recipientOptions = [
    { viewValue: "Email", value: "email" },
    { viewValue: "General Webhook", value: "webhook" },
  ];

  recipientForm = new UntypedFormGroup({
    recipientType: new UntypedFormControl("", [Validators.required]),
    url: new UntypedFormControl(""),
  });

  recipientType = this.recipientForm.get("recipientType") as UntypedFormControl;
  url = this.recipientForm.get("url") as UntypedFormControl;

  constructor(
    public dialogRef: MatDialogRef<NewRecipientComponent>,
    private alertsService: ProjectAlertsService
  ) {
    this.recipientDialogOpen$.subscribe(
      (resp) => !resp && this.dialogRef.close()
    );
  }

  ngOnInit(): void {
    // Dynamically set "url" validators
    this.recipientType.valueChanges.subscribe((type: RecipientType) => {
      this.url.clearValidators();
      if (type === "webhook") {
        this.url.setValue("https://")
        this.url.setValidators([
          Validators.required,
          Validators.pattern(urlRegex),
        ]);
      } else if (type === "email") {
        this.url.setValue("")
      }
      this.url.updateValueAndValidity();
    });
  }

  closeDialog() {
    this.alertsService.closeRecipientDialog();
  }

  selectOptions(
    recipientOptions: { viewValue: string; value: string }[],
    hideEmailOption?: boolean | null
  ): { viewValue: string; value: string }[] {
    return hideEmailOption
      ? this.recipientOptions.filter((option) => option.value !== "email")
      : recipientOptions;
  }

  onSubmit() {
    if (this.recipientForm.valid) {
      this.alertsService.addAlertRecipient(this.recipientForm.value);
    }
  }
}
