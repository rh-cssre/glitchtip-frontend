import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "gt-transaction-groups",
  templateUrl: "./transaction-groups.component.html",
  styleUrls: ["./transaction-groups.component.scss"],
})
export class TransactionGroupsComponent {
  sortForm = new FormGroup({
    sort: new FormControl({
      value: "",
      disabled: true,
    }),
  });
  dateForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });

  sorts = {
    "-last_seen": "Last Seen",
    last_seen: "First Seen",
    "-created": "Newest Creation Date",
    created: "Oldest Creation Date",
    "-count": "Most Frequent",
    count: "Least Frequent",
    "-priority": "Highest Priority",
    priority: "Lowest Priority",
  };
}
