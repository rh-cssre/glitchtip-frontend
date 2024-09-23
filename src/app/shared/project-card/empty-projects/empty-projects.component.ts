import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { ProjectCardComponent } from "../project-card.component";


@Component({
  standalone: true,
  selector: "gt-empty-projects",
  imports: [MatCardModule, ProjectCardComponent],
  templateUrl: "./empty-projects.component.html",
  styleUrls: ["./empty-projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyProjectsComponent {
  @Input() activeOrgOnly = false;
}
