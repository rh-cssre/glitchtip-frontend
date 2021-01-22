import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import {
  ProjectsService,
  ProjectsState,
} from "src/app/api/projects/projects.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-stateful-service";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent
  extends PaginationBaseComponent<ProjectsState, ProjectsService>
  implements OnDestroy {
  activeOrganizationSlug$ = this.organizationsService.activeOrganizationSlug$;
  projectsForActiveOrg$ = this.projectsService.projectsForActiveOrg$;
  activeOrganization$ = this.organizationsService.activeOrganization$;
  navigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([event, params, queryParams]) => {
      const orgSlug: string | undefined = params["org-slug"];
      const cursor: string | undefined = queryParams.cursor;
      const query: string | undefined = queryParams.query;

      const start: string | undefined = queryParams.start;
      const end: string | undefined = queryParams.end;
      return { orgSlug, cursor, query, start, end };
    })
  );
  routerEventSubscription: Subscription;

  constructor(
    private organizationsService: OrganizationsService,
    private projectsService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(projectsService);
    this.routerEventSubscription = this.navigationEnd$.subscribe(
      ({ orgSlug, cursor, query, start, end }) => {
        if (orgSlug) {
          this.projectsService.getProjectsByOrg(
            orgSlug,
            cursor,
            query,
            start,
            end
          );
        }
      }
    );
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
    this.projectsService.clearState();
  }
}
