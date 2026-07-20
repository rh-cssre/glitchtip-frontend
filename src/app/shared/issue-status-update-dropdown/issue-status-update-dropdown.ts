import {
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
  value: string;
  label: string;
  disabled?: boolean;
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

  selectedValue = input<string>();

  /** Trigger label reflects the current status (falls back to "Mark As"). */
  buttonLabel = computed(
    () =>
      this.options.find((o) => o.value === this.selectedValue())?.label ??
      $localize`Mark As`,
  );

  showResolveInNextRelease = input(false);
  resolvedInRelease = input(false);

  optionSelected = output<IssueStatus>();
  resolveInNextReleaseSelected = output<void>();

  /**
   * Whether a menu option represents the issue's current state. "Resolved" is
   * only active for a plain resolve; when the resolution is tied to a release,
   * the "Resolve in next release" item carries the check instead.
   */
  isActive(value: string): boolean {
    if (value === "resolved") {
      return this.selectedValue() === "resolved" && !this.resolvedInRelease();
    }
    return value === this.selectedValue();
  }

  onOptionClick(value: string) {
    this.optionSelected.emit(value as IssueStatus);
  }

  onResolveInNextRelease() {
    this.resolveInNextReleaseSelected.emit();
  }
}
