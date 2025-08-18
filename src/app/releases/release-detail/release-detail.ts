import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { ReleaseDetailService } from "./release-detail-state";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { ListFooterComponent } from "../../list-elements/list-footer/list-footer.component";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";

@Component({
  templateUrl: "./release-detail.html",
  styleUrls: ["./release-detail.scss"],
  imports: [
    MatTableModule,
    MatTooltipModule,
    ListFooterComponent,
    DetailHeaderComponent,
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
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}
