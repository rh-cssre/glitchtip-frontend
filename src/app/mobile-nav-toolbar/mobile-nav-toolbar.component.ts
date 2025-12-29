import { Component, Input, output } from "@angular/core";
import type { components } from "src/app/api/api-schema";

import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

type Organization = components["schemas"]["OrganizationDetailSchema"];

@Component({
  selector: "gt-mobile-nav-toolbar",
  templateUrl: "./mobile-nav-toolbar.component.html",
  styleUrls: ["./mobile-nav-toolbar.component.scss"],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
})
export class MobileNavToolbarComponent {
  @Input() activeOrg: Organization | null | undefined;
  readonly buttonClicked = output();
}
