import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
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
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { PlatformPickerComponent } from "../platform-picker/platform-picker.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { NewProjectService } from "./new-project-state";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  templateUrl: "./new-project.html",
  styleUrls: ["./new-project.scss"],
  imports: [
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    PlatformPickerComponent,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    LoadingButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewProjectService],
})
export class NewProject implements OnInit {
  private teamsService = inject(TeamsService);
  private service = inject(NewProjectService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

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

  ngOnInit() {
    this.teamsService.retrieveTeamsByOrg(this.orgSlug());
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
