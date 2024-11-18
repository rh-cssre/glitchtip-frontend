import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ProjectSettingsService } from "../../projects/project-settings.service";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-team-projects",
  templateUrl: "./team-projects.component.html",
  styleUrls: ["./team-projects.component.scss"],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatDividerModule,
    RouterLink,
    LoadingButtonComponent,
    AsyncPipe,
  ],
})
export class TeamProjectsComponent implements OnInit {
  userTeamRole$ = this.teamsService.userTeamRole$;
  projectsOnTeam$ = this.projectsService.projectsOnTeam$;
  projectsNotOnTeam$ = this.projectsService.projectsNotOnTeam$;
  loading$ = this.projectsService.addRemoveLoading$;
  errors$ = this.projectsService.errors$;
  project = new FormControl();
  teamSlug$ = this.route.paramMap.pipe(
    map((params) => params.get("team-slug")),
  );
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));

  constructor(
    private projectsService: ProjectSettingsService,
    private teamsService: TeamsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    combineLatest([this.orgSlug$, this.teamSlug$])
      .pipe(
        map(([orgSlug, teamSlug]) => {
          if (orgSlug && teamSlug) {
            this.projectsService.retrieveProjectsOnTeam(orgSlug, teamSlug);
            this.projectsService.retrieveProjectsNotOnTeam(orgSlug, teamSlug);
          }
        }),
      )
      .subscribe();
  }

  addProject() {
    const projectSlug = this.project.value;
    combineLatest([this.orgSlug$, this.teamSlug$])
      .pipe(
        map(([orgSlug, teamSlug]) => {
          if (orgSlug && teamSlug) {
            this.projectsService.addProjectToTeam(
              orgSlug,
              teamSlug,
              projectSlug,
            );
          }
        }),
      )
      .toPromise();
  }

  removeProject(projectSlug: string) {
    combineLatest([this.orgSlug$, this.teamSlug$])
      .pipe(
        map(([orgSlug, teamSlug]) => {
          if (orgSlug && teamSlug) {
            this.projectsService.removeProjectFromTeam(
              orgSlug,
              teamSlug,
              projectSlug,
            );
          }
        }),
      )
      .subscribe(() => this.project.reset());
  }
}
