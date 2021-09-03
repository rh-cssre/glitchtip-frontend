import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RecipientType } from "src/app/api/projects/project-alerts/project-alerts.interface";
import { ProjectAlertsService } from "../project-alerts.service";

@Component({
  selector: "gt-new-recipient",
  templateUrl: "./new-recipient.component.html",
  styleUrls: ["./new-recipient.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewRecipientComponent implements OnInit {
  recipientDialogOpen$ = this.alertsService.recipientDialogOpen$;
  emailSelected$ = this.alertsService.emailSelected$;

  recipientOptions = [
    { viewValue: "Email", value: "email" },
    { viewValue: "General Webhook", value: "webhook" },
  ];

  recipientForm = new FormGroup({
    recipientType: new FormControl("", [Validators.required]),
    url: new FormControl(""),
  });

  recipientType = this.recipientForm.get("recipientType") as FormControl;
  url = this.recipientForm.get("url") as FormControl;

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
        // https://stackoverflow.com/a/3809435/443457
        const urlReg = new RegExp(
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
        );
        this.url.setValidators([
          Validators.required,
          Validators.pattern(urlReg),
        ]);
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
