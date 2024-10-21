import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Organization } from "../api/organizations/organizations.interface";

import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: "gt-mobile-nav-toolbar",
  templateUrl: "./mobile-nav-toolbar.component.html",
  styleUrls: ["./mobile-nav-toolbar.component.scss"],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
})
export class MobileNavToolbarComponent {
  @Input() activeOrg: Organization | null | undefined;
  @Output() buttonClicked = new EventEmitter();
}
