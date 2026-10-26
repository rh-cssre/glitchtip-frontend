import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { SettingsService } from "../api/settings.service";
import { MatDivider } from "@angular/material/divider";
import { MatHint } from "@angular/material/form-field";
import { MarkdownComponent, provideMarkdown } from "ngx-markdown";

@Component({
  selector: "gt-system-info",
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatDivider,
    MatHint,
    MarkdownComponent,
  ],
  providers: [provideMarkdown()],
  templateUrl: "./system-info.component.html",
  styleUrls: ["./system-info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemInfoComponent {
  private settingsService = inject(SettingsService);

  enableOrganizationCreate = this.settingsService.enableOrganizationCreation;
  enableUserRegistration = this.settingsService.enableUserRegistration;
  serverTimeZone = this.settingsService.serverTimeZone;
  version = this.settingsService.version;
  instanceName = this.settingsService.instanceName;
}
