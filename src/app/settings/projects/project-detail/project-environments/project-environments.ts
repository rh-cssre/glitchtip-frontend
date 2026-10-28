import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { ProjectEnvironmentsService } from "./project-environments.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import { LoadingButtonComponent } from "../../../../shared/loading-button/loading-button.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";

@Component({
  selector: "gt-project-environments",
  templateUrl: "./project-environments.html",
  styleUrls: ["./project-environments.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SettingsSectionComponent,
    ListComponent,
    ListRowComponent,
    LoadingButtonComponent,
    EmptyStateComponent,
    PanelComponent,
    FormErrorComponent,
  ],
})
export class ProjectEnvironments {
  showText = $localize`Show`;
  hideText = $localize`Hide`;
  private service = inject(ProjectEnvironmentsService);
  private organizationsService = inject(OrganizationsService);
  initialLoad = this.service.initialLoad;
  loadError = this.service.loadError;
  toggleHiddenloading = this.service.toggleHiddenLoading;
  sortedEnvironments = this.service.sortedEnvironments;
  canWriteProject = this.organizationsService.canWriteProject;

  toggleHidden(environment: any) {
    this.service.updateEnvironment({
      ...environment,
      isHidden: !environment.isHidden,
    });
  }
}
