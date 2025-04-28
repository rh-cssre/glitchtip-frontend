import { Injectable, computed, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY, lastValueFrom } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import {
  Member,
  MemberDetail,
  MemberRole,
  MemberRoleDetail,
} from "../../../api/organizations/organizations.interface";
import { MembersAPIService } from "../../../api/organizations/members-api.service";
import { OrganizationsService } from "../../../api/organizations.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

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
  private membersAPIService = inject(MembersAPIService);
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

  updateMemberRole(updatedRole: MemberRole) {
    this.setUpdateMemberRoleLoadingStart();

    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const memberDetail = this.member();

    if (orgSlug && memberDetail) {
      const data = {
        orgRole: updatedRole,
        teamRoles: [],
      };

      return this.membersAPIService
        .update(orgSlug, memberDetail.id, data)
        .pipe(
          tap((resp) => {
            this.setUpdateMemberRole(resp);
            this.snackBar.open(
              `Successfully updated ${resp.email}'s role to ${resp.roleName}`,
            );
          }),
          catchError((error: HttpErrorResponse) => {
            this.setUpdateMemberRoleError(
              `${error.statusText}: ${error.status}`,
            );
            return EMPTY;
          }),
        )
        .toPromise();
    } else {
      return Promise.resolve(null);
    }
  }

  transferOrgOwnership() {
    this.setTransferOrgOwnershipLoadingStart();

    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const member = this.member();

    if (orgSlug && member) {
      return this.membersAPIService
        .makeOrgOwner(orgSlug, member.id)
        .pipe(
          tap((resp) => {
            this.snackBar.open(
              `Successfully transferred organization account ownership to ${resp.email}.`,
            );
            this.setTransferOrgOwnership(resp);
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 403 && err.error?.detail) {
              this.setTransferOrgOwnershipError(err.error?.detail);
            } else if (err.status === 400 && err.error?.message) {
              this.setTransferOrgOwnershipError(err.error?.message);
            } else {
              this.setTransferOrgOwnershipError(
                "Unable to transfer account ownership.",
              );
            }
            return EMPTY;
          }),
        )
        .toPromise();
    } else {
      // Handle the case where orgSlug or member is null
      return Promise.resolve(null);
    }
  }

  retrieveMemberDetail(orgSlug: string, memberId: number) {
    return lastValueFrom(
      this.membersAPIService
        .retrieve(orgSlug, memberId)
        .pipe(tap((memberDetail) => this.setMemberDetails(memberDetail))),
    );
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
      availableRoles: member.roles,
    });
  }
}
