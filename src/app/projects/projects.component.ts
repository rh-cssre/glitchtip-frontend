import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ProjectListComponent } from "../shared/project-list/project-list.component";
@Component({
  selector: "gt-projects",
  template: `<gt-project-list [activeOrgOnly]="true"></gt-project-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectListComponent],
})
export class ProjectsComponent {}
