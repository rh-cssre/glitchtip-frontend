import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ProjectEnvironment } from "src/app/api/organizations/organizations.interface";
import { ProjectEnvironmentsService } from "./project-environments.service";
import { LoadingButtonComponent } from "../../../../shared/loading-button/loading-button.component";
import { MatListModule } from "@angular/material/list";
import { AsyncPipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "gt-project-environments",
  templateUrl: "./project-environments.component.html",
  styleUrls: ["./project-environments.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatListModule,
    LoadingButtonComponent,
    AsyncPipe
],
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
