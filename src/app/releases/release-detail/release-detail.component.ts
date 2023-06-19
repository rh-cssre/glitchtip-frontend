import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { combineLatest } from "rxjs";
import { ReleaseDetailService } from "./release-detail.service";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { ListFooterComponent } from "../../list-elements/list-footer/list-footer.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgIf, NgFor, AsyncPipe } from "@angular/common";

@Component({
  templateUrl: "./release-detail.component.html",
  styleUrls: ["./release-detail.component.scss"],
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    ListFooterComponent,
    NgFor,
    AsyncPipe,
  ],
})
export class ReleaseDetailComponent {
  tooltipDisabled = false;
  displayedColumns = ["name"];

  release$ = this.service.release$;
  paginator$ = this.service.paginator$;
  releaseFiles$ = this.service.releaseFiles$;
  fileListErrors$ = this.service.releaseFileErrors$;
  loading$ = this.service.loading$;
  initialLoadComplete$ = this.service.initialLoadComplete$;

  constructor(
    protected service: ReleaseDetailService,
    protected route: ActivatedRoute
  ) {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([params, queryParams]) => {
        const orgSlug = params.get("org-slug");
        const version = params.get("version");
        if (orgSlug && version) {
          this.service.getRelease(orgSlug, version, queryParams.get("cursor"));
        }
      }
    );
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}
