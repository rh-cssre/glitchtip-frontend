import { Component } from "@angular/core";
// import { IssuesService } from "../issues.service";
import { issueList } from "./issues-test-data";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"]
})
export class IssuesPageComponent {
  resolved: boolean;
  displayedColumns: string[] = ["select", "title"];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  error: string;
  form = new FormGroup({
    status: new FormControl("", [Validators.required])
  });

  // constructor(private issuesService: IssuesService) {
  //   this.issuesService.retrieveIssues().subscribe();
  //   this.issuesService.getIssues.subscribe(
  //     issueList => (this.dataSource = new MatTableDataSource(issueList))
  //   );
  // }

  constructor() {
    this.dataSource = new MatTableDataSource(issueList);
  }

  onSubmit(status: string) {
    if (this.form.valid) {
      // this.selection.selected.forEach(selectedId => {
      //   this.issuesService.updateStatus(selectedId.id, {
      //     status: this.form.value.status = status
      //   });
      // });
    } else {
      console.log("dis form ain't valid, yo");
      this.error = "Error";
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    } else {
      return `${
        this.selection.isSelected(row) ? "deselect" : "select"
      } row ${row.position + 1}`;
    }
  }
}
