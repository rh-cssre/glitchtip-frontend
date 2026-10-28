import {
  Component,
  ChangeDetectionStrategy,
  effect,
  inject,
  input,
} from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { TeamsService } from "src/app/api/teams/teams.service";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { slugRegex } from "src/app/shared/validators";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";

@Component({
  selector: "gt-team-settings",
  templateUrl: "./team-settings.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    LoadingButtonComponent,
    SettingsSectionComponent,
    FormErrorComponent,
  ],
})
export class TeamSettingsComponent {
  private teamsService = inject(TeamsService);
  private organizationsService = inject(OrganizationsService);
  private dialog = inject(MatDialog);

  team = this.teamsService.team;
  loading = this.teamsService.loading;
  errors = this.teamsService.errors;
  canWriteTeam = this.organizationsService.canWriteTeam;
  canAdminTeam = this.organizationsService.canAdminTeam;
  form = new FormGroup({
    slug: new FormControl("", [
      Validators.required,
      Validators.pattern(slugRegex),
    ]),
  });

  get slug() {
    return this.form.get("slug");
  }
  orgSlug = input.required<string>({ alias: "org-slug" });
  teamSlug = input.required<string>({ alias: "team-slug" });

  constructor() {
    effect(() => {
      this.form.patchValue({ slug: this.teamSlug() });
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const newSlug = this.form.value.slug!;
    await this.teamsService.updateTeamSlug(
      this.orgSlug(),
      this.teamSlug(),
      newSlug,
    );
    // The service keeps the last error after a later success.
    const error = this.errors().updateName;
    if (error && this.team()?.slug !== newSlug) {
      mapFormErrors({ slug: [error] }, this.form);
    }
  }

  deleteTeam() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete #${this.teamSlug()}:team:?`,
        message: $localize`Its projects and members stay in the organization. This cannot be undone.`,
        confirmText: $localize`Delete`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.teamsService.deleteTeam(this.orgSlug(), this.teamSlug());
      }
    });
  }
}
