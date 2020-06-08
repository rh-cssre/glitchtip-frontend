import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TeamsService } from "src/app/api/teams/teams.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-new-team",
  templateUrl: "./new-team.component.html",
  styleUrls: ["./new-team.component.scss"],
})
export class NewTeamComponent {
  loading = false;
  errors: string[] = [];
  form = new FormGroup({
    slug: new FormControl("", [Validators.required]),
  });
  orgSlug: string;

  constructor(
    private teamsService: TeamsService,
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
      this.teamsService
        .createTeam(this.form.value.slug, this.data.orgSlug)
        .subscribe(
          (team) => {
            this.loading = false;
            this.snackBar.open(`${team.slug} has been created`, undefined, {
              duration: 4000,
            });
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
