import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { combineLatest, Subscription } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";
import {
  ProjectsService,
  ProjectsState,
} from "src/app/api/projects/projects.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-stateful-service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent
  extends PaginationBaseComponent<ProjectsState, ProjectsService>
  implements OnDestroy {
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  projects$ = this.projectsService.projectsForActiveOrg$;

  navigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([event, params, queryParams]) => {
      const cursor: string | undefined = queryParams.cursor;
      const query: string | undefined = queryParams.query;
      const project: string[] | null = null;
      const start: string | undefined = queryParams.start;
      const end: string | undefined = queryParams.end;
      return { cursor, query, project, start, end };
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

    this.routerEventSubscription = combineLatest([
      this.navigationEnd$,
      this.organizationsService.activeOrganizationSlug$,
    ]).subscribe(([{ cursor, query, project, start, end }, orgSlug]) => {
      if (orgSlug) {
        this.projectsService.getProjectsByOrg(
          orgSlug,
          cursor,
          query,
          project,
          start,
          end
        );
      }
    });
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
    this.projectsService.clearState();
  }
}
