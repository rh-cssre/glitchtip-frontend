import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ProjectEnvironment } from "src/app/api/organizations/organizations.interface";
import { ProjectEnvironmentsService } from "./project-environments.service";

@Component({
  selector: "gt-project-environments",
  templateUrl: "./project-environments.component.html",
  styleUrls: ["./project-environments.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEnvironmentsComponent implements OnDestroy {
  initialLoad$ = this.environmentsService.initialLoad$;
  toggleHiddenloading$ = this.environmentsService.toggleHiddenLoading$;
  error$ = this.environmentsService.error$;
  sortedEnvironments$ = this.environmentsService.sortedEnvironments$;

  constructor(private environmentsService: ProjectEnvironmentsService) {
    this.environmentsService.retrieveEnvironments().subscribe();
  }

  ngOnDestroy(): void {
    this.environmentsService.clearState();
  }

  toggleHidden(environment: ProjectEnvironment) {
    this.environmentsService
      .updateEnvironment({
        ...environment,
        isHidden: !environment.isHidden,
      })
      .subscribe();
  }
}
