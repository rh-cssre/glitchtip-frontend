import { Component, ChangeDetectionStrategy, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { ProjectCardComponent } from "../project-card.component";

@Component({
  selector: "gt-empty-projects",
  imports: [MatCardModule, ProjectCardComponent],
  templateUrl: "./empty-projects.component.html",
  styleUrls: ["./empty-projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyProjectsComponent {
  readonly activeOrgOnly = input(false);
}
