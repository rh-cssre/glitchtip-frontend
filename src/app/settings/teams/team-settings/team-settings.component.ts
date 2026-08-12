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
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "gt-team-settings",
  templateUrl: "./team-settings.component.html",
  styleUrls: ["./team-settings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    LoadingButtonComponent,
  ],
})
export class TeamSettingsComponent {
  private teamsService = inject(TeamsService);
  private dialog = inject(MatDialog);

  team = this.teamsService.team;
  loading = this.teamsService.loading;
  errors = this.teamsService.errors;
  form = new FormGroup({
    slug: new FormControl("", [Validators.required]),
  });
  orgSlug = input.required<string>({ alias: "org-slug" });
  teamSlug = input.required<string>({ alias: "team-slug" });

  constructor() {
    effect(() => {
      const teamSlug = this.teamSlug();
      this.teamsService.setTeamKey(this.orgSlug(), teamSlug);
      this.form.patchValue({ slug: teamSlug });
    });
  }

  onSubmit() {
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
