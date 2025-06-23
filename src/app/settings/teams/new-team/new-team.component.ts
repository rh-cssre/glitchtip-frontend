import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

import { MatFormFieldModule } from "@angular/material/form-field";

import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { SlugifyDirective } from "./slugify.directive";
import { slugRegex } from "src/app/shared/validators";

@Component({
  selector: "gt-new-team",
  templateUrl: "./new-team.component.html",
  styleUrls: ["./new-team.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SlugifyDirective,
    LoadingButtonComponent,
    MatButtonModule,
  ],
})
export class NewTeamComponent {
  private organizationsService = inject(OrganizationDetailService);
  private snackBar = inject(MatSnackBar);
  dialogRef = inject<MatDialogRef<NewTeamComponent>>(MatDialogRef);
  data = inject<{
    orgSlug: string;
  }>(MAT_DIALOG_DATA);

  loading = signal(false);
  errors: string[] = [];
  form = new FormGroup({
    slug: new FormControl("", [
      Validators.required,
      Validators.pattern(slugRegex),
    ]),
  });

  get slug() {
    return this.form.get("slug");
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading.set(true);
      this.organizationsService
        .createTeam(this.form.value.slug!, this.data.orgSlug)
        .then((result) => {
          this.loading.set(false);
          if (result.data) {
            this.snackBar.open(`${result.data.slug} has been created`);
          } else if (result.error) {
            // this.errors = [`${result.response.status}: ${err.status}`];
          }
          this.dialogRef.close();
        });
    }
  }
}
