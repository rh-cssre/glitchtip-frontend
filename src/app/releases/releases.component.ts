import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { ListTitleComponent } from "../list-elements/list-title/list-title.component";
import { ListFooterComponent } from "../list-elements/list-footer/list-footer.component";
import { ReleasesService } from "./releases.service";
import { combineLatest, map } from "rxjs";

@Component({
  templateUrl: "./releases.component.html",
  styleUrls: ["./releases.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ListTitleComponent,
    MatTableModule,
    RouterLink,
    MatTooltipModule,
    ListFooterComponent,
  ],
})
export class ReleasesComponent implements OnDestroy {
  paginator$ = this.service.paginator$;
  tooltipDisabled = false;
  displayedColumns = ["version", "created"];
  releases$ = this.service.releases$;
  errors$ = this.service.errors$;
  loading$ = this.service.loading$;
  initialLoadComplete$ = this.service.initialLoadComplete$;

  constructor(
    protected service: ReleasesService,
    protected route: ActivatedRoute
  ) {
    combineLatest([
      this.route.paramMap.pipe(map((params) => params.get("org-slug"))),
      this.route.queryParamMap,
    ]).subscribe(([orgSlug, params]) => {
      if (orgSlug) {
        this.service.getReleases(orgSlug, params.get("cursor"));
      }
    });
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }

  ngOnDestroy(): void {
    this.service.clearState();
  }
}
