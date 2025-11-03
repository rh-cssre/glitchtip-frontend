import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
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
export class TeamSettingsComponent implements OnInit {
  private teamsService = inject(TeamsService);

  team = this.teamsService.team;
  loading = this.teamsService.loading;
  errors = this.teamsService.errors;
  form = new FormGroup({
    slug: new FormControl("", [Validators.required]),
  });
  orgSlug = input.required<string>({ alias: "org-slug" });
  teamSlug = input.required<string>({ alias: "team-slug" });

  ngOnInit(): void {
    this.teamsService.retrieveSingleTeam(this.orgSlug(), this.teamSlug());
    this.form.patchValue({ slug: this.teamSlug() });
  }

  onSubmit() {
    const newSlug = this.form.value.slug;
    this.teamsService.updateTeamSlug(this.orgSlug(), this.teamSlug(), newSlug!);
  }

  deleteTeam() {
    if (window.confirm("Are you sure you want to delete this team?")) {
      this.teamsService.deleteTeam(this.orgSlug(), this.teamSlug());
    }
  }
}
