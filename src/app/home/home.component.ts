import { Component, ChangeDetectionStrategy } from "@angular/core";
@Component({
  selector: "gt-home",
  template: `<gt-project-list></gt-project-list>`,
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
