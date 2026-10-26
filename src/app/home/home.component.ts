import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ProjectListComponent } from "../shared/project-list/project-list.component";
@Component({
  selector: "gt-home",
  template: `<gt-project-list></gt-project-list>`,
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectListComponent],
})
export class HomeComponent {}
