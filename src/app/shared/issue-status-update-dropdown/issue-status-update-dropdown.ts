import {
  booleanAttribute,
  Component,
  ChangeDetectionStrategy,
  computed,
  output,
  input,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { IssueStatus } from "src/app/issues/interfaces";

interface StatusOption {
  value: IssueStatus;
  label: string;
}

@Component({
  selector: "gt-issue-status-update-dropdown",
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
  templateUrl: "./issue-status-update-dropdown.html",
  styleUrls: ["./issue-status-update-dropdown.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueStatusUpdateDropdownComponent {
  readonly options: StatusOption[] = [
    { value: "resolved", label: $localize`Resolved` },
    { value: "unresolved", label: $localize`Unresolved` },
    { value: "ignored", label: $localize`Ignored` },
  ];

  readonly selectedValue = input.required<IssueStatus>();
  /** Color of the status dot, matching gt-status-pill. No dot when unset. */
  readonly statusColor = input<string>();
  readonly resolvedInRelease = input(false, { transform: booleanAttribute });

  readonly optionSelected = output<IssueStatus>();
  readonly resolveInNextReleaseSelected = output<void>();

  buttonLabel = computed(
    () => this.options.find((o) => o.value === this.selectedValue())?.label,
  );

  /**
   * Whether a menu option represents the issue's current state. "Resolved" is
   * only active for a plain resolve; when the resolution is tied to a release,
   * the "Resolve in next release" item carries the check instead.
   */
  isActive(value: IssueStatus): boolean {
    if (value === "resolved") {
      return this.selectedValue() === "resolved" && !this.resolvedInRelease();
    }
    return value === this.selectedValue();
  }

  selectStatus(value: IssueStatus) {
    if (!this.isActive(value)) {
      this.optionSelected.emit(value);
    }
  }
}
