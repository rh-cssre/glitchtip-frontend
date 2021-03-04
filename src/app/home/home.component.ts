import { Component, ChangeDetectionStrategy } from "@angular/core";
@Component({
  selector: "app-home",
  template: `<app-project-list></app-project-list>`,
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
