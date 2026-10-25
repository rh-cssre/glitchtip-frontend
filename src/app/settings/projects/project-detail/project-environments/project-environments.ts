import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  OnInit,
} from "@angular/core";
import { ProjectEnvironmentsService } from "./project-environments.service";
import { LoadingButtonComponent } from "../../../../shared/loading-button/loading-button.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";

@Component({
  selector: "gt-project-environments",
  templateUrl: "./project-environments.html",
  styleUrls: ["./project-environments.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ListComponent,
    ListRowComponent,
    LoadingButtonComponent,
    EmptyStateComponent,
  ],
  providers: [ProjectEnvironmentsService],
})
export class ProjectEnvironments implements OnInit {
  private service = inject(ProjectEnvironmentsService);
  orgSlug = input.required<string>();
  projectSlug = input.required<string>();

  initialLoad = this.service.initialLoad;
  toggleHiddenloading = this.service.toggleHiddenLoading;
  sortedEnvironments = this.service.sortedEnvironments;
  accessProjectWrite = inject(OrganizationsService).accessProjectWrite;

  ngOnInit(): void {
    this.service.setParams(this.orgSlug(), this.projectSlug());
  }

  toggleHidden(environment: any) {
    this.service.updateEnvironment({
      ...environment,
      isHidden: !environment.isHidden,
    });
  }
}
