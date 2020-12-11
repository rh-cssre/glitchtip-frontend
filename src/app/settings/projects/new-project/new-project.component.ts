import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectsService } from "../../../api/projects/projects.service";
import { TeamsService } from "src/app/api/teams/teams.service";
import { map, filter, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { NewTeamComponent } from "../../teams/new-team/new-team.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "app-new-project",
  templateUrl: "./new-project.component.html",
  styleUrls: ["./new-project.component.scss"],
})
export class NewProjectComponent implements OnInit {
  teams$ = this.teamsService.teams$;
  loading = false;
  error?: string;
  orgSlug?: string;
  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
    platform: new FormControl(""),
    team: new FormControl("", [Validators.required]),
  });

  constructor(
    private orgService: OrganizationsService,
    private projectsService: ProjectsService,
    private teamsService: TeamsService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.teams$.subscribe((data) => {
      if (data && data[0]) {
        this.form.patchValue({
          team: data[0].slug,
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
    this.route.params
      .pipe(
        map((params) => params["org-slug"] as string),
        filter((slug) => !!slug),
        tap((slug) => (this.orgSlug = slug))
      )
      .subscribe((slug) => {
        this.teamsService.retrieveTeamsByOrg(slug).toPromise();
      });
  }

  openCreateTeamDialog() {
    this.dialog.open(NewTeamComponent, {
      maxWidth: "500px",
      data: {
        orgSlug: this.orgSlug,
      },
    });
  }

  onSubmit() {
    if (this.form.valid && this.orgSlug) {
      this.loading = true;
      this.projectsService
        .createProject(
          {
            name: this.form.value.name,
            platform: this.form.value.platform,
          },
          this.form.value.team,
          this.orgSlug
        )
        .subscribe(
          (project) => {
            this.loading = false;
            this.orgService.refreshOrganizationDetail();
            this.snackBar.open(`${project.name} has been created`);
            this.router.navigate(["organizations", this.orgSlug, "issues"], {
              queryParams: { project: project.id },
            });
          },
          (err) => {
            this.loading = false;
            this.error = `${err.statusText}: ${err.status}`;
          }
        );
    }
  }
}
