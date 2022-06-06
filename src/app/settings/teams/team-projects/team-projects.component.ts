import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormControl } from "@angular/forms";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { TeamsService } from "src/app/api/teams/teams.service";
import { ProjectSettingsService } from "../../projects/project-settings.service";

@Component({
  selector: "gt-team-projects",
  templateUrl: "./team-projects.component.html",
  styleUrls: ["./team-projects.component.scss"],
})
export class TeamProjectsComponent implements OnInit {
  userTeamRole$ = this.teamsService.userTeamRole$;
  projectsOnTeam$ = this.projectsService.projectsOnTeam$;
  projectsNotOnTeam$ = this.projectsService.projectsNotOnTeam$;
  loading$ = this.projectsService.addRemoveLoading$;
  errors$ = this.projectsService.errors$;
  project = new UntypedFormControl();
  teamSlug$ = this.route.paramMap.pipe(
    map((params) => params.get("team-slug"))
  );
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));

  constructor(
    private projectsService: ProjectSettingsService,
    private teamsService: TeamsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    combineLatest([this.orgSlug$, this.teamSlug$])
      .pipe(
        map(([orgSlug, teamSlug]) => {
          if (orgSlug && teamSlug) {
            this.projectsService.retrieveProjectsOnTeam(orgSlug, teamSlug);
            this.projectsService.retrieveProjectsNotOnTeam(orgSlug, teamSlug);
          }
        })
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
              projectSlug
            );
          }
        })
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
              projectSlug
            );
          }
        })
      )
      .subscribe(() => this.project.reset());
  }
}
