import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { PaginationBaseComponent } from "../shared/stateful-service/pagination-base.component";
import { ReleasesService, ReleasesState } from "./releases.service";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { ListFooterComponent } from "../list-elements/list-footer/list-footer.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { ListTitleComponent } from "../list-elements/list-title/list-title.component";
import { NgIf, NgFor, AsyncPipe, DatePipe } from "@angular/common";

@Component({
    templateUrl: "./releases.component.html",
    styleUrls: ["./releases.component.scss"],
    standalone: true,
    imports: [
        NgIf,
        ListTitleComponent,
        MatTableModule,
        RouterLink,
        MatTooltipModule,
        ListFooterComponent,
        NgFor,
        AsyncPipe,
        DatePipe,
    ],
})
export class ReleasesComponent extends PaginationBaseComponent<
  ReleasesState,
  ReleasesService
> {
  tooltipDisabled = false;
  displayedColumns = ["version", "created"];
  releases$ = this.releasesService.releases$;
  errors$ = this.releasesService.errors$;
  loading$ = this.service.loading$;
  initialLoadComplete$ = this.service.initialLoadComplete$;

  constructor(
    private releasesService: ReleasesService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(releasesService, router, route);
    this.activeCombinedParams$.subscribe(([params, queryParams]) => {
      if (params["org-slug"]) {
        this.releasesService.getReleases(
          params["org-slug"],
          queryParams["cursor"]
        );
      }
    });
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}
