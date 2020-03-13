import {
  Component,
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
import { Router } from "@angular/router";

@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  styleUrls: ["./header-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavComponent {
  /** All projects available */
  projects$ = this.organizationsService.activeOrganizationProjects$;

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

  @Output() applyFilter: EventEmitter<number[]>;

  @ViewChild(MatSelectionList, { static: false })
  private selectionList: MatSelectionList;

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
    const selectedProjectIds = this.selectedProjectIds.getValue();
    this.router.navigate([], {
      queryParams: {
        project: selectedProjectIds.length > 0 ? selectedProjectIds : null
      },
      queryParamsHandling: "merge"
    });
  }

  constructor(
    private organizationsService: OrganizationsService,
    private router: Router
  ) {}
}
