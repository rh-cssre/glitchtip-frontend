import { Injectable, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "../../api/user/user.service";
import { OrganizationsService } from "../../api/organizations.service";
import { OrganizationDetailService } from "../../api/organizations/organization-detail.service";
import { components } from "../../api/api-schema";
import { client, handleError } from "src/app/shared/api/api";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

type Member = components["schemas"]["OrganizationUserSchema"];

interface MembersState {
  loadingResendInvite: number | null;
  sentResendInvite: number[];
}

const initialState: MembersState = {
  loadingResendInvite: null,
  sentResendInvite: [],
};

@Injectable()
export class MembersService extends StatefulService<MembersState> {
  router = inject(Router);
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  readonly loadingResendInvite = computed(
    () => this.state().loadingResendInvite,
  );
  readonly sentResendInvite = computed(() => this.state().sentResendInvite);
  /** Organization members with computed loading/success data */
  readonly members = computed(() => {
    const members = this.organizationDetailService.organizationMembers();
    const loadingResendInvite = this.loadingResendInvite();
    const sentResendInvite = this.sentResendInvite();
    const activeUserEmail = this.userService.activeUserEmail();
    return members.map((member) => {
      return {
        ...member,
        loadingResendInvite:
          member.id === loadingResendInvite?.toString() ? true : false,
        sentResendInvite: sentResendInvite.includes(parseInt(member.id))
          ? true
          : false,
        isMe: member.email === activeUserEmail ? true : false,
      };
    });
  });

  constructor() {
    super(initialState);
  }

  /** Send another invite to already invited org member */
  async resendInvite(member: Member) {
    this.setLoadingResendInvite(member.id);
    const body: any = {
      email: member.email,
      orgRole: member.role,
      teamRoles: [],
      reinvite: true,
    };
    const { data } = await client.POST(
      "/api/0/organizations/{organization_slug}/members/",
      {
        params: {
          path: {
            organization_slug:
              this.organizationsService.activeOrganizationSlug(),
          },
        },
        body,
      },
    );
    if (data) {
      this.setResendInviteSuccess(member.id);
    } else {
      this.clearLoadingResendInvite();
    }
  }

  /** Remove member for active organization. */
  async removeMember(member: Member, isRemovingSelf: boolean = false) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const { error, response } = await client.DELETE(
      "/api/0/organizations/{organization_slug}/members/{member_id}/",
      {
        params: {
          path: {
            organization_slug:
              this.organizationsService.activeOrganizationSlug(),
            member_id: parseInt(member.id),
          },
        },
      },
    );
    if (error) {
      const errors = handleError(error, response);
      let message = $localize`Error attempting to remove ${member.email} from organization`;
      if (errors.detail.length) {
        message += errors.detail[0].msg;
      }
      this.snackBar.open(message);
    } else {
      this.snackBar.open(
        $localize`Successfully removed ${member.email} from organization`,
      );
      if (isRemovingSelf) {
        this.organizationsService.reload();
        this.organizationsService.setActiveOrganizationSlug(null);
        this.router.navigate(["/"]);
      }
      if (orgSlug) {
        await this.organizationDetailService.retrieveOrganizationMembers(
          orgSlug,
        );
      }
    }
  }

  private setLoadingResendInvite(memberId: string) {
    this.setState({
      loadingResendInvite: parseInt(memberId),
    });
  }

  private setResendInviteSuccess(memberId: string) {
    const state = this.state();
    this.setState({
      loadingResendInvite: null,
      sentResendInvite: [...state.sentResendInvite, parseInt(memberId)],
    });
  }

  private clearLoadingResendInvite() {
    this.setState({ loadingResendInvite: null });
  }
}
