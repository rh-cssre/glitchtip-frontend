import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
} from "@angular/core";
import { Subscription } from "rxjs";
import { distinct, filter, tap } from "rxjs/operators";
import { ProjectSettingsService } from "./project-settings.service";
import { ProjectCardComponent } from "../../shared/project-card/project-card.component";
import { EmptyProjectsComponent } from "../../shared/project-card/empty-projects/empty-projects.component";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { AsyncPipe, DatePipe } from "@angular/common";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  templateUrl: "./projects.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    EmptyProjectsComponent,
    ProjectCardComponent,
    AsyncPipe,
    DatePipe,
  ],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private organizationsService = inject(OrganizationsService);
  private projectSettingsService = inject(ProjectSettingsService);

  subscription?: Subscription;
  activeOrganization = this.organizationsService.activeOrganization;
  projectsForActiveOrg$ = this.projectSettingsService.projects$;

  ngOnInit() {
    this.subscription = this.organizationsService.activeOrganizationSlug$
      .pipe(
        distinct(),
        filter((slug) => !!slug),
        tap((slug) => this.projectSettingsService.retrieveProjects(slug!)),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
