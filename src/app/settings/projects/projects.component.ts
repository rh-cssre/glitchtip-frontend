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

@Component({
  templateUrl: "./projects.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit, OnDestroy {
  subscription?: Subscription;
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
