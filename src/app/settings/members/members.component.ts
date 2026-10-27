import {
  Component,
  ChangeDetectionStrategy,
  effect,
  inject,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { MembersService } from "src/app/settings/members/members.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { MatButtonModule } from "@angular/material/button";
import { OrganizationsService } from "src/app/api/organizations.service";
import { components } from "src/app/api/api-schema";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { roleName } from "src/app/settings/members/member-roles";

type Member = components["schemas"]["OrganizationUserSchema"];

@Component({
  selector: "gt-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    LoadingButtonComponent,
    TopAppBar,
    ListComponent,
    ListRowComponent,
  ],
  providers: [MembersService],
})
export class MembersComponent {
  leaveText = $localize`Leave`;
  removeText = $localize`Remove`;
  actionsForLabel = (email: string) => $localize`Actions for ${email}:email:`;
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private membersService = inject(MembersService);
  private dialog = inject(MatDialog);

  orgSlug = input.required<string>({ alias: "org-slug" });
  activeOrganizationDetail = this.organizationsService.activeOrganization;
  members = this.membersService.members;
  canWriteMember = this.organizationsService.canWriteMember;
  canAdminMember = this.organizationsService.canAdminMember;
  roleName = roleName;

  constructor() {
    effect(() => {
      this.organizationDetailService.setMembersOrgSlug(this.orgSlug());
    });
  }

  resendInvite(member: Member) {
    this.membersService.resendInvite(member);
  }

  removeMember(member: any) {
    const orgName = this.activeOrganizationDetail()?.name ?? "";
    let data;
    if (member.isMe) {
      data = {
        title: $localize`Leave ${orgName}:org:?`,
        message: $localize`You'll lose access to its projects and stop getting its alerts.`,
        confirmText: $localize`Leave`,
      };
    } else if (member.pending) {
      data = {
        title: $localize`Remove invite?`,
        message: $localize`The invite to ${member.email}:email: will stop working.`,
        confirmText: $localize`Remove`,
      };
    } else {
      data = {
        title: $localize`Remove ${member.email}:email:?`,
        message: $localize`${member.email}:email: will lose access to ${orgName}:org: and its projects.`,
        confirmText: $localize`Remove`,
      };
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.membersService.removeMember(member as any, member.isMe);
      }
    });
  }
}
