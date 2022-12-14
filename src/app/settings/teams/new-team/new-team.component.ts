import { Component, Inject } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "gt-new-team",
  templateUrl: "./new-team.component.html",
  styleUrls: ["./new-team.component.scss"],
})
export class NewTeamComponent {
  loading = false;
  errors: string[] = [];
  form = new UntypedFormGroup({
    slug: new UntypedFormControl("", [Validators.required]),
  });
  orgSlug?: string;

  constructor(
    private organizationsService: OrganizationsService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NewTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { orgSlug: string }
  ) {}

  get slug() {
    return this.form.get("slug");
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.organizationsService
        .createTeam(this.form.value.slug, this.data.orgSlug)
        .subscribe(
          (team) => {
            this.loading = false;
            this.snackBar.open(`${team.slug} has been created`);
            this.dialogRef.close();
          },
          (err) => {
            this.loading = false;
            if (err.error.slug?.length) {
              this.errors = err.error.slug;
            } else {
              this.errors = [`${err.statusText}: ${err.status}`];
            }
          }
        );
    }
  }
}
