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

@Component({
  imports: [MatCheckbox, MatButton],
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
