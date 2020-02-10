import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { map, startWith } from "rxjs/operators";
import { Observable, BehaviorSubject, combineLatest, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import {
  MatSelectionList,
  MatSelectionListChange
} from "@angular/material/list";
import { OrganizationProduct } from "../../api/organizations/organizations.interface";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { IssuesService } from "../issues.service";

@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  styleUrls: ["./header-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavComponent implements OnInit {
  /** All projects available */
  projects$ = this.organizationsService.activeOrganizationProjects$;

  /** Projects that were previously selected and applied */
  appliedProjectIds$ = this.issuesService.appliedProjectIds$;

  /** Projects that are selected in this component but not yet applied */
  selectedProjectIds = new BehaviorSubject<number[]>([]);

  /** Observable of selectedProjectIds */
  selectedProjectIds$ = this.selectedProjectIds.asObservable();

  /** Use selected projects to generate a string that's displayed in the UI */
  selectedProjectsString$ = combineLatest([
    this.projects$,
    this.selectedProjectIds$
  ]).pipe(
    map(([projects, selectedProjectIds]) => {
      switch (selectedProjectIds.length) {
        case 0:
          return "My Projects";
        case projects?.length:
          return "All Projects";
        default:
          return selectedProjectIds
            .map(id => projects?.find(project => id === project.id)?.name)
            .join(", ");
      }
    })
  );

  /** Used to filter project names */
  filterProjectInput = new FormControl();

  /** Projects that are filtered via the text field form control */
  filteredProjects$: Observable<OrganizationProduct[] | null> = combineLatest([
    this.projects$.pipe(startWith([] as OrganizationProduct[])),
    this.filterProjectInput.valueChanges.pipe(startWith(""))
  ]).pipe(
    map(([projects, value]) =>
      projects
        ? projects.filter(project =>
            project.name.toLowerCase().includes(value.toLowerCase())
          )
        : null
    )
  );

  selectedEqualsAppliedProjects$ = combineLatest([
    this.appliedProjectIds$,
    this.selectedProjectIds$
  ]).pipe(
    map(
      ([appliedProjectIds, selectedProjectIds]) =>
        appliedProjectIds?.sort().join(",") ===
        selectedProjectIds.sort().join(",")
    )
  );

  isAllSelected$ = combineLatest([
    this.projects$,
    this.selectedProjectIds$
  ]).pipe(
    map(
      ([projects, selectedProjectIds]) =>
        projects
          ?.map(project => project.id)
          .sort()
          .join(",") === selectedProjectIds.sort().join(",")
    )
  );

  selectAllSubject = new Subject<any>();
  selectAllSubscription = combineLatest([
    this.selectAllSubject,
    this.projects$
  ]).subscribe(([_, projects]) => {
    this.selectionList.selectAll();
    this.selectedProjectIds.next(
      projects ? projects.map(project => project.id) : []
    );
  });

  resetSubject = new Subject<any>();
  resetSubscription = combineLatest([
    this.resetSubject,
    this.appliedProjectIds$
  ]).subscribe(([_, projectIds]) => {
    this.selectedProjectIds.next(
      projectIds ? projectIds.map(id => parseInt(id, 10)) : []
    );
  });

  @Output() applyFilter: EventEmitter<number[]>;

  @ViewChild(MatSelectionList, { static: false })
  private selectionList: MatSelectionList;

  ngOnInit() {
    this.resetSubject.next();
  }

  updateSelectedOptions(change: MatSelectionListChange) {
    this.selectedProjectIds.next(
      change.source.selectedOptions.selected.map(
        selectedOption => selectedOption.value
      )
    );
  }

  isSelected(projectId: number) {
    return this.selectedProjectIds.getValue().find(id => id === projectId);
  }

  submitApplyFilter() {
    this.applyFilter.emit(this.selectedProjectIds.getValue());
  }

  constructor(
    private organizationsService: OrganizationsService,
    private issuesService: IssuesService
  ) {}
}
