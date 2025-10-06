import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { ListTitleComponent } from "../list-elements/list-title/list-title.component";
import { ListFooterComponent } from "../list-elements/list-footer/list-footer.component";
import { ReleasesService } from "./releases-state";

@Component({
  templateUrl: "./releases.html",
  styleUrls: ["./releases.scss"],
  imports: [
    DatePipe,
    ListTitleComponent,
    MatTableModule,
    RouterLink,
    MatTooltipModule,
    ListFooterComponent,
  ],
  providers: [ReleasesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Releases {
  protected service = inject(ReleasesService);

  orgSlug = input.required<string>({ alias: "org-slug" });
  cursor = input<string | undefined>();
  paginator = this.service.paginator;
  tooltipDisabled = false;
  displayedColumns = ["version", "created"];
  releases = this.service.releases;
  errors = this.service.errors;
  isLoading = this.service.isLoading;
  initialLoadComplete = this.service.initialLoadComplete;

  constructor() {
    effect(() =>
      this.service.params.set({
        orgSlug: this.orgSlug(),
        cursor: this.cursor(),
      }),
    );
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}
