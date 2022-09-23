import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tap } from "rxjs";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import {
  ReleaseDetailService,
  ReleaseDetailState,
} from "./release-detail.service";
import { checkForOverflow } from "src/app/shared/shared.utils";

@Component({
  templateUrl: "./release-detail.component.html",
  styleUrls: ["./release-detail.component.scss"],
})
export class ReleaseDetailComponent extends PaginationBaseComponent<
  ReleaseDetailState,
  ReleaseDetailService
> {
  tooltipDisabled = false
  displayedColumns = ["name"];

  release$ = this.service.release$;
  releaseFiles$ = this.service.releaseFiles$;
  fileListErrors$ = this.service.releaseFileErrors$;
  loading$ = this.service.loading$;
  initialLoadComplete$ = this.service.initialLoadComplete$;

  constructor(
    protected service: ReleaseDetailService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(service, router, route);
    this.activeCombinedParams$
      .pipe(
        tap(([params, queryParams]) => {
          if (params["org-slug"]) {
            this.service.getRelease(
              params["org-slug"],
              params.version,
              queryParams["cursor"]
            );
          }
        })
      )
      .subscribe();
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}
