import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { startWith, map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatSelectionListChange, MatSelectionList } from "@angular/material";

@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  styleUrls: ["./header-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavComponent implements OnInit {
  /** All projects available */
  @Input() projects: string[];
  /** Projects that were previously selected and applied */
  @Input() appliedProjects: string[];
  /** Projects that are selected in this component but not yet applied */
  private selectedProjects = new BehaviorSubject<string[]>([]);
  /** Projects that are filtered via the text field form control */
  filteredProjects$: Observable<string[]>;

  selectedProjects$ = this.selectedProjects.asObservable();
  selectedProjectString = this.selectedProjects$.pipe(
    map(value => this.getSelectedProjectString(value))
  );
  filterProjectInput = new FormControl();

  @Output() applyFilter: EventEmitter<string[]>;

  @ViewChild(MatSelectionList, { static: false })
  private selectionList: MatSelectionList;

  ngOnInit() {
    this.filteredProjects$ = this.filterProjectInput.valueChanges.pipe(
      startWith(""),
      map(value => this.filter(value))
    );

    this.selectedProjects.next(this.appliedProjects);
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.projects.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private getSelectedProjectString(selectedProjects: string[]) {
    switch (selectedProjects.length) {
      case 0:
        return "My Projects";
      case this.projects.length:
        return "All Projects";
      default:
        return selectedProjects.join(", ");
    }
  }

  updateSelectedOptions(change: MatSelectionListChange) {
    this.selectedProjects.next(
      change.source.selectedOptions.selected.map(
        selectedOption => selectedOption.value
      )
    );
  }

  cancelSelected() {
    this.selectedProjects.next(this.appliedProjects);
  }

  selectAll() {
    this.selectionList.selectAll();
    this.selectedProjects.next(this.projects);
  }

  isSelected(project: string) {
    return this.selectedProjects
      .getValue()
      .find(selectedProject => selectedProject === project);
  }

  applyButtonIsDisabled() {
    const a = this.appliedProjects.sort().join("");
    const b = this.selectedProjects
      .getValue()
      .sort()
      .join("");
    return a === b;
  }

  submitApplyFilter() {
    this.applyFilter.emit(this.selectedProjects.getValue());
  }

  constructor() {}
}
