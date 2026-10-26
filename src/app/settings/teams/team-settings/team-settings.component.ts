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

@Component({
  selector: "gt-team-settings",
  templateUrl: "./team-settings.component.html",
  styleUrls: ["./team-settings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    LoadingButtonComponent,
    SettingsSectionComponent,
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
      const teamSlug = this.teamSlug();
      this.teamsService.setTeamKey(this.orgSlug(), teamSlug);
      this.form.patchValue({ slug: teamSlug });
    });
    effect(() => {
      const error = this.errors().updateName;
      if (error) mapFormErrors({ slug: [error] }, this.form);
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const newSlug = this.form.value.slug;
    this.teamsService.updateTeamSlug(this.orgSlug(), this.teamSlug(), newSlug!);
  }

  deleteTeam() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete team?`,
        message: $localize`Are you sure you want to delete this team?`,
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
