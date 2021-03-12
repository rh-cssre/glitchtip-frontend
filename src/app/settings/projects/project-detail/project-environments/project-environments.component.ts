import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ProjectEnvironment } from "src/app/api/organizations/organizations.interface";
import { ProjectEnvironmentsService } from "./project-environments.service";

@Component({
  selector: "app-project-environments",
  templateUrl: "./project-environments.component.html",
  styleUrls: ["./project-environments.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEnvironmentsComponent implements OnInit {
  initialLoad$ = this.environmentsService.initialLoad$;
  toggleHiddenloading$ = this.environmentsService.toggleHiddenLoading$;
  error$ = this.environmentsService.error$;
  sortedEnvironments$ = this.environmentsService.sortedEnvironments$;

  constructor(private environmentsService: ProjectEnvironmentsService) {}

  ngOnInit(): void {
    this.environmentsService.retrieveEnvironments();
  }

  toggleHidden(environment: ProjectEnvironment) {
    this.environmentsService.updateEnvironment({
      ...environment,
      isHidden: !environment.isHidden,
    });
  }
}
