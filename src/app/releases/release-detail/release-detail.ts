import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { ReleaseDetailService } from "./release-detail-state";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { PaginationButtons } from "src/app/list-elements/pagination-buttons/pagination-buttons";
import { stringAttribute } from "src/app/shared/shared.utils";

@Component({
  templateUrl: "./release-detail.html",
  styleUrls: ["./release-detail.scss"],
  imports: [
    MatTableModule,
    MatTooltipModule,
    DetailHeaderComponent,
    BackLinkComponent,
    PaginationButtons,
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

  releaseTitle = computed(() => {
    const release = this.release();
    const count = this.paginator()?.count;
    if (!release) {
      return undefined;
    }
    let title = $localize`Release files for ` + release.version;
    if (count) {
      title += ` (${count})`;
    }
    return title;
  });

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
