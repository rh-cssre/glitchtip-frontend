import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Organization } from "../api/organizations/organizations.interface";

@Component({
  selector: "gt-mobile-nav-toolbar",
  templateUrl: "./mobile-nav-toolbar.component.html",
  styleUrls: ["./mobile-nav-toolbar.component.scss"],
})
export class MobileNavToolbarComponent {
  @Input() activeOrg: Organization | null | undefined;
  @Output() buttonClicked = new EventEmitter();
}
