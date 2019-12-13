import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectsService } from "../../api/projects/projects.service";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit {
  projects$ = this.projectsService.getProjects;
  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }

  onDelete(organizationSlug: string, projectSlug: string) {
    this.projectsService
      .deleteProject(organizationSlug, projectSlug)
      .pipe(
        catchError(err => {
          console.log("error:", err);
          return of(null);
        })
      )
      .subscribe();
  }
}
