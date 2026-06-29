import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  OnInit,
} from "@angular/core";
import { ProjectEnvironmentsService } from "./project-environments.service";
import { LoadingButtonComponent } from "../../../../shared/loading-button/loading-button.component";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "gt-project-environments",
  templateUrl: "./project-environments.html",
  styleUrls: ["./project-environments.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatListModule,
    LoadingButtonComponent,
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
