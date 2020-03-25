import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
  HostListener,
  ElementRef
} from "@angular/core";
import { map, startWith } from "rxjs/operators";
import { Observable, combineLatest } from "rxjs";
import { FormControl } from "@angular/forms";
import { OrganizationProduct } from "../../api/organizations/organizations.interface";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatExpansionPanel } from "@angular/material/expansion";
import { normalizeProjectParams } from "../utils";

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
    map(params => normalizeProjectParams(params.project))
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

  @ViewChild("filterInput", { static: false })
  filterInput: ElementRef<HTMLInputElement>;

  @HostListener("document:keydown", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === "/" && !this.expansionPanel.expanded) {
      event.preventDefault();
      // turns out this is where the scrolling is happening for whatever reason
      document.querySelector(".mat-sidenav-content")?.scrollTo(0, 0);
      this.expansionPanel.open();
    }
    if (event.key === "Escape" && this.expansionPanel.expanded) {
      this.expansionPanel.close();
    }
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

  focusPanel() {
    // G R O S S
    // no timeout didn't work though, nor did 0, 1ms, 10ms timeouts
    setTimeout(() => this.filterInput.nativeElement.focus(), 100);
  }

  selectProjectAndClose(projectId: number) {
    this.navigate([projectId]);
    this.expansionPanel.close();
  }

  toggleProject(projectId: number) {
    const appliedIds = [...this.appliedProjectIds].map(id => parseInt(id, 10));
    const idMatchIndex = appliedIds.indexOf(projectId);
    if (idMatchIndex > -1) {
      appliedIds.splice(idMatchIndex, 1);
    } else {
      appliedIds.push(projectId);
    }
    this.navigate(appliedIds.length > 0 ? appliedIds : null);
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
