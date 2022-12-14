import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute } from "@angular/router";
import { EMPTY } from "rxjs";
import { map, filter, tap, exhaustMap, catchError } from "rxjs/operators";
import { TeamsService } from "src/app/api/teams/teams.service";
import { NewTeamComponent } from "../../teams/new-team/new-team.component";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ProjectSettingsService } from "../project-settings.service";

@Component({
  selector: "gt-new-project",
  templateUrl: "./new-project.component.html",
  styleUrls: ["./new-project.component.scss"],
})
export class NewProjectComponent implements OnInit {
  teams$ = this.teamsService.teams$;
  loading = false;
  error?: string;
  orgSlug?: string;
  form = new UntypedFormGroup({
    name: new UntypedFormControl("", [Validators.required]),
    platform: new UntypedFormControl(""),
    team: new UntypedFormControl("", [Validators.required]),
  });

  constructor(
    private orgService: OrganizationsService,
    private projectsService: ProjectSettingsService,
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
        .pipe(
          tap(() => (this.loading = false)),
          exhaustMap((project) =>
            this.orgService.refreshOrganizationDetail().pipe(
              tap((organization) => {
                this.snackBar.open(`${project.name} has been created`);
                this.router.navigate([organization.slug, "issues"], {
                  queryParams: { project: project.id },
                });
              })
            )
          ),
          catchError((err) => {
            this.loading = false;
            this.error = `${err.statusText}: ${err.status}`;
            return EMPTY;
          })
        )
        .toPromise();
    }
  }
}
