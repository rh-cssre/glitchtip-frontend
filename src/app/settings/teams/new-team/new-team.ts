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
import { handleError } from "src/app/shared/api/api";

@Component({
  templateUrl: "./new-team.html",
  styleUrls: ["./new-team.scss"],
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
  errors = signal<string[]>([]);
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

  async onSubmit() {
    if (this.form.valid) {
      this.loading.set(true);
      const result = await this.organizationsService.createTeam(
        this.form.value.slug!,
        this.data.orgSlug,
      );
      this.loading.set(false);
      if (result.data) {
        this.snackBar.open(`${result.data.slug} has been created`);
        this.dialogRef.close();
      } else {
        if (result.response.status === 404) {
          this.errors.set([
            $localize`You do not have permission to create a team`,
          ]);
        } else {
          this.errors.set(
            handleError(result.error, result.response).detail.map(
              (err) => err.msg,
            ),
          );
        }
      }
    }
  }
}
