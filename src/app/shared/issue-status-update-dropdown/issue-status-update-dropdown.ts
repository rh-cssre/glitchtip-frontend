import {
  Component,
  ChangeDetectionStrategy,
  output,
  input,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { IssueStatus } from "src/app/issues/interfaces";

interface StatusOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: "gt-issue-status-update-dropdown",
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: "./issue-status-update-dropdown.html",
  styleUrls: ["./issue-status-update-dropdown.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueStatusUpdateDropdownComponent {
  readonly options: StatusOption[] = [
    { value: "resolved", label: "Resolved" },
    { value: "unresolved", label: "Unresolved" },
    { value: "ignored", label: "Ignored" },
  ];

  readonly buttonLabel = "Mark As";

  selectedValue = input<string>();

  optionSelected = output<IssueStatus>();

  onOptionClick(value: string) {
    this.optionSelected.emit(value as IssueStatus);
  }
}
