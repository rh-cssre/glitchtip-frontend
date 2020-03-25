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
    if (this.expansionPanel.expanded) {
      if (event.key === "Escape") {
        this.expansionPanel.close();
      }
      if (event.key === "ArrowDown") {
        this.moveDown();
      }
      if (event.key === "ArrowUp") {
        this.moveUp();
      }
    }
  }

  moveDown() {
    const projectButtons = Array.from(
      document.querySelectorAll(".picker-button")
    ) as HTMLElement[];
    // If the text box is focused, go to the first item
    if (this.filterInput.nativeElement.id === document.activeElement?.id) {
      projectButtons[0]?.focus();
    } else {
      const indexOfActive = projectButtons.findIndex(
        button => button.id === document.activeElement?.id
      );
      if (indexOfActive <= projectButtons.length - 2) {
        // If we're in the list items, go to the next list item
        projectButtons[indexOfActive + 1].focus();
      } else {
        // If we're in the last list item, go to the first item
        projectButtons[0].focus();
      }
    }
  }

  moveUp() {
    const projectButtons = Array.from(
      document.querySelectorAll(".picker-button")
    ) as HTMLElement[];
    const indexOfActive = projectButtons.findIndex(
      button => button.id === document.activeElement?.id
    );
    if (indexOfActive > 0) {
      // If we're in the list items, go to the previous list item
      projectButtons[indexOfActive - 1].focus();
    } else {
      // If we're in the first list item, go to the first item
      this.filterInput.nativeElement.focus();
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
    // G R O S S. Needed it though. 0, 1ms, 10ms timeouts didn't work
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
