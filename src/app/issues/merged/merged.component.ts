import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from "@angular/core";
import { MergedService } from "./merged.service";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatButton } from "@angular/material/button";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";

@Component({
  imports: [
    MatCheckbox,
    MatButton,
    PanelComponent,
    ListComponent,
    ListRowComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./merged.component.html",
  styleUrl: "./merged.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MergedService],
})
export class MergedComponent implements OnInit {
  issueID = input.required<string>({ alias: "issue-id" });
  orgSlug = input.required<string>({ alias: "org-slug" });
  service = inject(MergedService);
  hashes = this.service.hashes;
  loading = this.service.loading;
  failed = this.service.failed;
  selectedCount = computed(() => this.service.selectedHashes().length);

  allowUnmerge = computed(() => {
    const selectedHashes = this.service.selectedHashes().length;
    const hashesLength = this.hashes().length;
    return selectedHashes > 0 && selectedHashes < hashesLength;
  });

  ngOnInit() {
    this.service.setParams(this.orgSlug(), this.issueID());
  }

  toggleCheck(id: string) {
    this.service.toggleHash(id);
  }

  unmerge() {
    this.service.unmerge();
  }
}
