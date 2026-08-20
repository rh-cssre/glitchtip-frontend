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
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { OrganizationsService } from "src/app/api/organizations.service";
import { components } from "src/app/api/api-schema";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";

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
    TopAppBar,
  ],
  providers: [MembersService],
})
export class MembersComponent {
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private membersService = inject(MembersService);
  private dialog = inject(MatDialog);

  orgSlug = input.required<string>({ alias: "org-slug" });
  activeOrganizationDetail = this.organizationsService.activeOrganization;
  members = this.membersService.members;
  accessMemberWrite = this.organizationsService.accessMemberWrite;

  constructor() {
    effect(() => {
      this.organizationDetailService.setMembersOrgSlug(this.orgSlug());
    });
  }

  resendInvite(member: Member) {
    this.membersService.resendInvite(member);
  }

  removeMember(member: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: member.isMe
          ? $localize`Leave organization`
          : $localize`Remove member`,
        message: member.isMe
          ? $localize`Are you sure you'd like to leave this organization?`
          : $localize`Are you sure you want to remove ${member.email} from this organization?`,
        confirmText: member.isMe ? $localize`Leave` : $localize`Remove`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.membersService.removeMember(member as any, member.isMe);
      }
    });
  }
}
