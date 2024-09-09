import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute } from "@angular/router";
import { EMPTY } from "rxjs";
import { map, filter, tap, exhaustMap, catchError } from "rxjs/operators";
import { TeamsService } from "src/app/api/teams/teams.service";
import { NewTeamComponent } from "../../teams/new-team/new-team.component";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ProjectSettingsService } from "../project-settings.service";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { PlatformPickerComponent } from "../platform-picker/platform-picker.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AsyncPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "gt-new-project",
  templateUrl: "./new-project.component.html",
  styleUrls: ["./new-project.component.scss"],
  standalone: true,
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
    AsyncPipe
],
})
export class NewProjectComponent implements OnInit {
  teams$ = this.teamsService.teams$;
  loading = false;
  error?: string;
  orgSlug?: string;
  form = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(64)]),
    platform: new FormControl(""),
    team: new FormControl("", [Validators.required]),
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
            name: this.form.value.name!,
            platform: this.form.value.platform ?? "",
          },
          this.form.value.team!,
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
