import { Component, ChangeDetectionStrategy } from "@angular/core";
@Component({
  selector: "gt-projects",
  template: `<gt-project-list [activeOrgOnly]="true"></gt-project-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {}
