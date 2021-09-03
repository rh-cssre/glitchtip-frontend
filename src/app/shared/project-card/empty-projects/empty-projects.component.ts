import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "gt-empty-projects",
  templateUrl: "./empty-projects.component.html",
  styleUrls: ["./empty-projects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyProjectsComponent {
  @Input() activeOrgOnly = false;
}
