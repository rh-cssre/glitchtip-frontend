import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { TeamsService } from "src/app/api/teams/teams.service";
import { NewTeamComponent } from "../../teams/new-team/new-team";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { PlatformPickerComponent } from "./platform-picker/platform-picker.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NewProjectService } from "./new-project-state";
import { Router, RouterLink } from "@angular/router";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations.service";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { PanelComponent } from "src/app/shared/panel/panel.component";

@Component({
  templateUrl: "./new-project.html",
  styleUrls: ["./new-project.scss"],
  imports: [
    MatDialogModule,
    RouterLink,
    TopAppBar,
    BackLinkComponent,
    PageHeaderComponent,
    SettingsSectionComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    PlatformPickerComponent,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    LoadingButtonComponent,
    FormErrorComponent,
    PanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewProjectService],
})
export class NewProject {
  assignTeamText = $localize`Assign a team`;
  createTeamText = $localize`Create a team`;
  private teamsService = inject(TeamsService);
  private service = inject(NewProjectService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  canWriteTeam = inject(OrganizationsService).canWriteTeam;

  orgSlug = input.required<string>({ alias: "org-slug" });
  teams = this.teamsService.teams;
  error = this.service.error;
  loading = this.service.loading;
  form = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(64)]),
    platform: new FormControl(""),
    team: new FormControl("", [Validators.required]),
  });

  constructor() {
    effect(() => {
      this.teamsService.setTeamsOrgSlug(this.orgSlug());
    });
    effect(() => {
      const teams = this.teams();
      if (teams?.length) {
        this.form.patchValue({
          team: teams[0].slug,
        });
      }
    });
  }

  get name() {
    return this.form.get("name");
  }

  get team() {
    return this.form.get("team");
  }

  openCreateTeamDialog() {
    this.dialog.open(NewTeamComponent, {
      maxWidth: "500px",
      data: {
        orgSlug: this.orgSlug(),
      },
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      const data = await this.service.createProject(
        {
          name: this.form.value.name!,
          platform: this.form.value.platform ?? "",
        } as any,
        this.form.value.team!,
        this.orgSlug(),
      );
      if (data) {
        this.snackBar.open($localize`${data.name} has been created`);
        this.router.navigate([this.orgSlug(), "issues"], {
          queryParams: { project: data.id },
        });
      }
    }
  }
}
