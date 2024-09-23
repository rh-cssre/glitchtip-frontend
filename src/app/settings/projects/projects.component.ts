import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Subscription } from "rxjs";
import { distinct, filter, tap } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ProjectSettingsService } from "./project-settings.service";
import { ProjectCardComponent } from "../../shared/project-card/project-card.component";
import { EmptyProjectsComponent } from "../../shared/project-card/empty-projects/empty-projects.component";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { AsyncPipe, DatePipe } from "@angular/common";

@Component({
  templateUrl: "./projects.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    EmptyProjectsComponent,
    ProjectCardComponent,
    AsyncPipe,
    DatePipe
],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  subscription?: Subscription;
  activeOrg$ = this.organizationsService.activeOrganization$;
  projects$ = this.organizationsService.activeOrganizationProjects$;
  projectsForActiveOrg$ = this.projectSettingsService.projects$;

  constructor(
    private organizationsService: OrganizationsService,
    private projectSettingsService: ProjectSettingsService
  ) {}

  ngOnInit() {
    this.subscription = this.organizationsService.activeOrganizationSlug$
      .pipe(
        distinct(),
        filter((slug) => !!slug),
        tap((slug) => this.projectSettingsService.retrieveProjects(slug!))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
