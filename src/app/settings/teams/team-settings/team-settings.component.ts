import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ActivatedRoute } from "@angular/router";
import { map, take } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-team-settings",
  templateUrl: "./team-settings.component.html",
  styleUrls: ["./team-settings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    LoadingButtonComponent,
    AsyncPipe,
  ],
})
export class TeamSettingsComponent implements OnInit {
  team$ = this.teamsService.team$;
  loading$ = this.teamsService.loading$;
  errors$ = this.teamsService.errors$;
  form = new FormGroup({
    slug: new FormControl("", [Validators.required]),
  });
  routeSlugs$ = this.route.paramMap.pipe(
    map((params) => [params.get("org-slug"), params.get("team-slug")]),
  );

  constructor(
    private teamsService: TeamsService,
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.routeSlugs$
      .pipe(
        map(([orgSlug, teamSlug]) => {
          if (orgSlug && teamSlug) {
            this.teamsService.retrieveSingleTeam(orgSlug, teamSlug);
            this.form.patchValue({ slug: teamSlug });
          }
        }),
      )
      .subscribe();
  }

  onSubmit() {
    const newSlug = this.form.value.slug;
    this.routeSlugs$
      .pipe(
        take(1),
        map(([orgSlug, teamSlug]) => {
          if (orgSlug && teamSlug) {
            this.teamsService
              .updateTeamSlug(orgSlug, teamSlug, newSlug!)
              .subscribe((resp) => {
                this.organizationsService.updateTeam(resp.id, resp.slug);
              });
          }
        }),
      )
      .toPromise();
  }

  deleteTeam() {
    if (window.confirm("Are you sure you want to delete this team?")) {
      this.routeSlugs$
        .pipe(
          map(([orgSlug, teamSlug]) => {
            if (orgSlug && teamSlug) {
              this.teamsService
                .deleteTeam(orgSlug, teamSlug)
                .subscribe(() =>
                  this.organizationsService.deleteTeam(teamSlug),
                );
            }
          }),
        )
        .toPromise();
    }
  }
}
