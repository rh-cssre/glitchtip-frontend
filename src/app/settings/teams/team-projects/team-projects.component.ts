import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "src/app/api/projects/projects.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/internal/operators/map";
import { TeamsService } from "src/app/api/teams/teams.service";
import { FormControl } from "@angular/forms";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-team-projects",
  templateUrl: "./team-projects.component.html",
  styleUrls: ["./team-projects.component.scss"],
})
export class TeamProjectsComponent implements OnInit {
  userTeamRole$ = this.teamsService.userTeamRole$;
  projectsOnTeam$ = this.projectsService.projectsOnTeam$;
  projectsNotOnTeam$ = this.projectsService.projectsNotOnTeam$;
  loading$ = this.projectsService.loading$;
  errors$ = this.projectsService.errors$;
  project = new FormControl();
  teamSlug$ = this.route.paramMap.pipe(
    map((params) => params.get("team-slug"))
  );
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));

  constructor(
    private projectsService: ProjectsService,
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
