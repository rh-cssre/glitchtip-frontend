import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit
} from "@angular/core";
import { map, startWith } from "rxjs/operators";
import { Observable, BehaviorSubject, combineLatest, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatSelectionListChange } from "@angular/material/list";
import { OrganizationProduct } from "../../api/organizations/organizations.interface";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatExpansionPanel } from "@angular/material/expansion";

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
  appliedProjectIds$ = this.activatedRoute.queryParams.pipe(
    map(params => {
      const project = params.project;
      let projectToReturn: string[] = [];
      if (typeof project === "string") {
        projectToReturn = [project];
      } else if (typeof project === "object") {
        projectToReturn = project;
      }
      return projectToReturn;
    })
  );

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

  someProjectsAreSelected$ = this.selectedProjectIds$.pipe(
    map(selectedProjectIds => selectedProjectIds.length !== 0)
  );

  resetSubject = new Subject<any>();

  resetSubscription = combineLatest([
    this.resetSubject,
    this.appliedProjectIds$
  ]).subscribe(([_, projectIds]) => {
    this.selectedProjectIds.next(
      projectIds ? projectIds.map(id => parseInt(id, 10)) : []
    );
  });

  @ViewChild("expansionPanel", { static: false })
  private expansionPanel: MatExpansionPanel;

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

  /**
   * @param allProjects Optional override that clears project params, which
   * shows all projects
   */
  submitApplyFilter(allProjects = false) {
    const selectedProjectIds = this.selectedProjectIds.getValue();
    let project: number[] | null = null;
    if (selectedProjectIds.length !== 0 && allProjects === false) {
      project = selectedProjectIds;
    }
    this.router.navigate([], {
      queryParams: { project },
      queryParamsHandling: "merge"
    });
    this.expansionPanel.close();
  }

  ngOnInit() {
    this.resetSubject.next();
  }

  constructor(
    private organizationsService: OrganizationsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
}
