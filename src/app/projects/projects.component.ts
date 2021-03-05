import { Component, ChangeDetectionStrategy } from "@angular/core";
@Component({
  selector: "app-projects",
  template: `<app-project-list [activeOrgOnly]="true"></app-project-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {}
