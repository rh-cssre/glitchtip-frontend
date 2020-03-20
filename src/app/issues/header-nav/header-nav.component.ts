import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit
} from "@angular/core";
import { map, startWith } from "rxjs/operators";
import { Observable, combineLatest } from "rxjs";
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

  appliedProjectIds: string[];

  /** Use selected projects to generate a string that's displayed in the UI */
  appliedProjectsString$ = combineLatest([
    this.projects$,
    this.appliedProjectIds$
  ]).pipe(
    map(([projects, ids]) => {
      switch (ids.length) {
        case 0:
          return "My Projects";
        case projects?.length:
          return "All Projects";
        default:
          return ids
            .map(
              id =>
                projects?.find(project => parseInt(id, 10) === project.id)?.name
            )
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

  someProjectsAreSelected$ = this.appliedProjectIds$.pipe(
    map(ids => ids.length !== 0)
  );

  @ViewChild("expansionPanel", { static: false })
  expansionPanel: MatExpansionPanel;

  updateAppliedProjects(change: MatSelectionListChange) {
    const project: number[] = change.source.selectedOptions.selected.map(
      selectedOption => selectedOption.value
    );
    this.navigate(project.length > 0 ? project : null);
  }

  navigate(project: number[] | null) {
    this.router.navigate([], {
      queryParams: { project: project ? project : null },
      queryParamsHandling: "merge"
    });
  }

  isSelected(projectId: number) {
    return this.appliedProjectIds.find(id => parseInt(id, 10) === projectId);
  }

  ngOnInit() {
    this.appliedProjectIds$.subscribe(ids => {
      this.appliedProjectIds = ids;
    });
  }

  constructor(
    private organizationsService: OrganizationsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
}
