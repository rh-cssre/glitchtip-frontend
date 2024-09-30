import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, EMPTY, filter, lastValueFrom } from "rxjs";
import { map, take, exhaustMap, tap, catchError } from "rxjs/operators";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import {
  Member,
  MemberDetail,
  MemberRole,
  MemberRoleDetail,
} from "./organizations.interface";
import { MembersAPIService } from "./members-api.service";
import { OrganizationsService } from "./organizations.service";

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
  readonly member$ = this.getState$.pipe(map((data) => data.member));
  readonly memberTeams$ = this.getState$.pipe(map((data) => data.memberTeams));
  readonly availableRoles$ = this.getState$.pipe(
    map((data) => data.availableRoles)
  );
  readonly updateMemberRoleError$ = this.getState$.pipe(
    map((state) => state.updateMemberRoleError)
  );
  readonly updateMemberRoleLoading$ = this.getState$.pipe(
    map((state) => state.updateMemberRoleLoading)
  );
  readonly transferOrgOwnershipError$ = this.getState$.pipe(
    map((state) => state.transferOrgOwnershipError)
  );
  readonly transferOrgOwnershipLoading$ = this.getState$.pipe(
    map((state) => state.transferOrgOwnershipLoading)
  );

  constructor(
    private membersAPIService: MembersAPIService,
    private organizationsService: OrganizationsService,
    private snackBar: MatSnackBar
  ) {
    super(initialState);
  }

  updateMemberRole(updatedRole: MemberRole) {
    this.setUpdateMemberRoleLoadingStart();
    return lastValueFrom(
      combineLatest([
        this.organizationsService.activeOrganizationSlug$,
        this.member$,
      ]).pipe(
        filter(([orgslug, memberDetail]) => !!orgslug && !!memberDetail),
        take(1),
        exhaustMap(([orgSlug, memberDetail]) => {
          const data = {
            orgRole: updatedRole,
            teamRoles: []
          };
          return this.membersAPIService
            .update(orgSlug!, memberDetail!.id, data)
            .pipe(
              tap((resp) => {
                this.setUpdateMemberRole(resp);
                this.snackBar.open(
                  `Successfully updated ${resp.email}'s role to ${resp.roleName}`
                );
              }),
              catchError((error: HttpErrorResponse) => {
                this.setUpdateMemberRoleError(
                  `${error.statusText}: ${error.status}`
                );
                return EMPTY;
              })
            );
        })
      ),
      { defaultValue: null }
    );
  }

  transferOrgOwnership() {
    this.setTransferOrgOwnershipLoadingStart();
    lastValueFrom(
      combineLatest([
        this.organizationsService.activeOrganizationSlug$,
        this.member$,
      ]).pipe(
        filter(([orgSlug, member]) => !!orgSlug && !!member),
        take(1),
        exhaustMap(([orgSlug, member]) => {
          return this.membersAPIService.makeOrgOwner(orgSlug!, member!.id).pipe(
            tap((resp) => {
              this.snackBar.open(
                `Successfully transferred organization account ownership to ${resp.email}.`
              );
              this.setTransferOrgOwnership(resp);
            }),
            catchError((err: HttpErrorResponse) => {
              if (err instanceof HttpErrorResponse) {
                if (err.status === 403 && err.error?.detail) {
                  this.setTransferOrgOwnershipError(err.error?.detail);
                } else if (err.status === 400 && err.error?.message) {
                  this.setTransferOrgOwnershipError(err.error?.message);
                } else {
                  this.setTransferOrgOwnershipError(
                    "Unable to transfer account ownership."
                  );
                }
              }
              return EMPTY;
            })
          );
        })
      ),
      { defaultValue: null }
    );
  }

  retrieveMemberDetail(orgSlug: string, memberId: number) {
    return lastValueFrom(
      this.membersAPIService
        .retrieve(orgSlug, memberId)
        .pipe(tap((memberDetail) => this.setMemberDetails(memberDetail)))
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
