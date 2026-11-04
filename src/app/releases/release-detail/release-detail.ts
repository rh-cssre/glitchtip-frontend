import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { ReleaseDetailService } from "./release-detail-state";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { PaginationButtons } from "src/app/list-elements/pagination-buttons/pagination-buttons";
import { stringAttribute } from "src/app/shared/shared.utils";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { LoadingOverlayComponent } from "src/app/shared/loading-overlay/loading-overlay.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { RecordBandComponent } from "src/app/shared/record-band/record-band.component";

@Component({
  templateUrl: "./release-detail.html",
  styleUrls: ["./release-detail.scss"],
  imports: [
    DatePipe,
    MatTableModule,
    MatTooltipModule,
    PageHeaderComponent,
    RecordBandComponent,
    BackLinkComponent,
    PaginationButtons,
    TopAppBar,
    LoadingOverlayComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ReleaseDetailService],
})
export class ReleaseDetail {
  protected service = inject(ReleaseDetailService);

  tooltipDisabled = false;
  displayedColumns = ["name"];

  orgSlug = input.required<string>({ alias: "org-slug" });
  version = input.required<string>();
  cursor = input(undefined, { transform: stringAttribute });

  release = this.service.release;
  paginator = this.service.paginator;
  releaseFiles = this.service.releaseFiles;
  fileListErrors = this.service.releaseFileErrors;
  loading = this.service.loading;
  initialLoadComplete = this.service.initialLoadComplete;
  constructor() {
    effect(() =>
      this.service.params.set({
        orgSlug: this.orgSlug(),
        version: this.version(),
      }),
    );
    effect(() =>
      this.service.queryParams.set({
        cursor: this.cursor(),
      }),
    );
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}
