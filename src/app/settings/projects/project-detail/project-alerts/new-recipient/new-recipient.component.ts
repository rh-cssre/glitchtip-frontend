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
  ];

  recipientForm = new FormGroup({
    recipientType: new FormControl("", [Validators.required]),
    url: new FormControl(""),
  });

  recipientType = this.recipientForm.get("recipientType") as FormControl;
  url = this.recipientForm.get("url") as FormControl;

  ngOnInit(): void {
    // Dynamically set "url" validators
    this.recipientType.valueChanges.subscribe((type: RecipientType) => {
      this.url.clearValidators();
      if (type === "webhook") {
        this.url.setValue("https://");
        this.url.setValidators([
          Validators.required,
          Validators.pattern(urlRegex),
        ]);
      } else if (type === "email") {
        this.url.setValue("");
      } else if (type == "discord") {
        this.url.setValue("");
      } else if (type == "googlechat") {
        this.url.setValue("https://chat.googleapis.com/v1/spaces/");
        this.url.setValidators([Validators.required]);
      }
      this.url.updateValueAndValidity();
    });
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
      this.dialogRef.close(this.recipientForm.value);
    }
  }
}
