import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "app-empty-projects",
  templateUrl: "./empty-projects.component.html",
  styleUrls: ["./empty-projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyProjectsComponent {
  @Input() activeOrgOnly = false;
}
