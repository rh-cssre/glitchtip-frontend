import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { MembersService } from "src/app/settings/members/members.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { OrganizationsService } from "src/app/api/organizations.service";
import { components } from "src/app/api/api-schema";

type Member = components["schemas"]["OrganizationUserSchema"];

@Component({
  selector: "gt-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    LoadingButtonComponent,
    MatTooltipModule,
  ],
  providers: [MembersService],
})
export class MembersComponent implements OnInit {
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private membersService = inject(MembersService);

  orgSlug = input.required<string>({ alias: "org-slug" });
  activeOrganizationDetail = this.organizationsService.activeOrganization;
  members = this.membersService.members;

  ngOnInit(): void {
    this.organizationDetailService.retrieveOrganizationMembers(this.orgSlug());
  }

  resendInvite(member: Member) {
    this.membersService.resendInvite(member);
  }

  removeMember(member: any) {
    const message = member.isMe
      ? `Are you sure you'd like to leave this organization?`
      : `Are you sure you want to remove ${member.email} from this organization?`;
    if (window.confirm(message)) {
      this.membersService.removeMember(member as any, member.isMe);
    }
  }
}
