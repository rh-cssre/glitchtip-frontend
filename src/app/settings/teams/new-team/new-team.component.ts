import { Component, Inject } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { MatButtonModule } from "@angular/material/button";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { SlugifyDirective } from "./slugify.directive";
import { MatInputModule } from "@angular/material/input";
import { NgFor, NgIf } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
    selector: "gt-new-team",
    templateUrl: "./new-team.component.html",
    styleUrls: ["./new-team.component.scss"],
    standalone: true,
    imports: [
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        NgFor,
        MatInputModule,
        SlugifyDirective,
        NgIf,
        LoadingButtonComponent,
        MatButtonModule,
    ],
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
