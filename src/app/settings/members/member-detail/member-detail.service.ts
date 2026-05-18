import { Injectable, computed, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  MemberRole,
  MemberRoleDetail,
} from "../../../api/organizations/organizations.interface";
import { OrganizationsService } from "../../../api/organizations.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client, handleError } from "src/app/shared/api/api";
import { components } from "src/app/api/api-schema";

type Member = components["schemas"]["OrganizationUserSchema"];
type MemberDetail = components["schemas"]["OrganizationUserDetailSchema"];

interface MemberDetailState {
  member: Member | null;
  memberTeams: string[] | null;
  availableRoles: MemberRoleDetail[] | null;
  updateMemberRoleError: string;
  updateMemberRoleLoading: boolean;
  transferOrgOwnershipError: string;
  transferOrgOwnershipLoading: boolean;
}

const initialState: MemberDetailState = {
  member: null,
  memberTeams: null,
  availableRoles: null,
  updateMemberRoleError: "",
  updateMemberRoleLoading: false,
  transferOrgOwnershipError: "",
  transferOrgOwnershipLoading: false,
};

@Injectable({ providedIn: "root" })
export class MemberDetailService extends StatefulService<MemberDetailState> {
  private organizationsService = inject(OrganizationsService);
  private snackBar = inject(MatSnackBar);

  readonly member = computed(() => this.state().member);
  readonly memberTeams = computed(() => this.state().memberTeams);
  readonly availableRoles = computed(() => this.state().availableRoles);
  readonly updateMemberRoleError = computed(
    () => this.state().updateMemberRoleError,
  );
  readonly updateMemberRoleLoading = computed(
    () => this.state().updateMemberRoleLoading,
  );
  readonly transferOrgOwnershipError = computed(
    () => this.state().transferOrgOwnershipError,
  );
  readonly transferOrgOwnershipLoading = computed(
    () => this.state().transferOrgOwnershipLoading,
  );

  constructor() {
    super(initialState);
  }

  async updateMemberRole(updatedRole: MemberRole) {
    this.setUpdateMemberRoleLoadingStart();

    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const memberDetail = this.member();

    if (orgSlug && memberDetail) {
      const body = {
        orgRole: updatedRole,
        teamRoles: [],
      };

      const { data, error, response } = await client.PUT(
        "/api/0/organizations/{organization_slug}/members/{member_id}/",
        {
          params: {
            path: {
              organization_slug: orgSlug,
              member_id: parseInt(memberDetail.id),
            },
          },
          body,
        },
      );
      if (data) {
        this.setUpdateMemberRole(data);
        this.snackBar.open(
          $localize`Successfully updated ${data.email}'s role to ${data.roleName}`,
        );
      } else {
        const errors = handleError(error, response);
        if (errors.detail.length) {
          this.setUpdateMemberRoleError(errors.detail[0].msg);
        }
      }
    }
  }

  async transferOrgOwnership() {
    this.setTransferOrgOwnershipLoadingStart();

    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const member = this.member();

    if (orgSlug && member) {
      const { data, error, response } = await client.POST(
        "/api/0/organizations/{organization_slug}/members/{member_id}/set_owner/",
        {
          params: {
            path: {
              organization_slug: orgSlug,
              member_id: parseInt(member.id),
            },
          },
        },
      );
      if (data) {
        this.snackBar.open(
          $localize`Successfully transferred organization account ownership to ${data.email}.`,
        );
        this.setTransferOrgOwnership(data);
      } else {
        const errors = handleError(error, response);
        if (errors.detail.length) {
          this.setTransferOrgOwnershipError(errors.detail[0].msg);
        }
      }
    }
  }

  async retrieveMemberDetail(orgSlug: string, memberId: number) {
    const { data } = await client.GET(
      "/api/0/organizations/{organization_slug}/members/{member_id}/",
      {
        params: {
          path: { organization_slug: orgSlug, member_id: memberId },
        },
      },
    );
    if (data) {
      this.setMemberDetails(data);
    }
  }

  private setUpdateMemberRoleError(updateMemberRoleError: string) {
    this.setState({ updateMemberRoleLoading: false, updateMemberRoleError });
  }

  private setUpdateMemberRoleLoadingStart() {
    this.setState({ updateMemberRoleLoading: true });
  }

  private setUpdateMemberRole(member: Member) {
    this.setState({ updateMemberRoleLoading: false, member });
  }

  private setTransferOrgOwnershipLoadingStart() {
    this.setState({ transferOrgOwnershipLoading: true });
  }

  private setTransferOrgOwnership(member: Member) {
    this.setState({
      transferOrgOwnershipLoading: false,
      member,
    });
  }

  private setTransferOrgOwnershipError(errorMessage: string) {
    this.setState({
      transferOrgOwnershipLoading: false,
      transferOrgOwnershipError: errorMessage,
    });
  }

  private setMemberDetails(member: MemberDetail) {
    this.setState({
      member,
      memberTeams: member.teams,
      availableRoles: (member as any).roles,
    });
  }
}
