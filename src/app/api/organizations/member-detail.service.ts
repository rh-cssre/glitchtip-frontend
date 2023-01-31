import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  filter,
  lastValueFrom,
} from "rxjs";
import { map, take, exhaustMap, tap, catchError } from "rxjs/operators";
import { Member } from "./organizations.interface";
import { MembersAPIService } from "./members-api.service";
import { OrganizationsService } from "./organizations.service";

interface MemberDetailState {
  memberDetail: Member | null;
  updateMemberError: string;
  updateMemberLoading: boolean;
}

const initialState: MemberDetailState = {
  memberDetail: null,
  updateMemberError: "",
  updateMemberLoading: false,
};

@Injectable({ providedIn: "root" })
export class MemberDetailService {
  private readonly state = new BehaviorSubject<MemberDetailState>(initialState);
  private readonly getState$ = this.state.asObservable();
  readonly memberDetail$ = this.getState$.pipe(
    map((data) => data.memberDetail)
  );
  readonly updateMemberError$ = this.getState$.pipe(
    map((state) => state.updateMemberError)
  );
  readonly updateMemberLoading$ = this.getState$.pipe(
    map((state) => state.updateMemberLoading)
  );

  constructor(
    private membersService: MembersAPIService,
    private organizationsService: OrganizationsService,
    private snackBar: MatSnackBar
  ) {}

  /** Update member teams and/or permissions */
  updateMember(updatedRole: string) {
    this.setUpdateMemberLoading(true);
    return lastValueFrom(
      combineLatest([
        this.organizationsService.activeOrganizationSlug$,
        this.memberDetail$,
      ]).pipe(
        filter(([orgslug, memberDetail]) => !!orgslug && !!memberDetail),
        take(1),
        exhaustMap(([orgSlug, memberDetail]) => {
          const data = {
            ...memberDetail!,
            role: updatedRole,
          };
          return this.membersService.update(orgSlug!, data).pipe(
            tap((resp) => {
              this.setUpdateMemberLoading(false);
              this.snackBar.open(
                `Successfully updated ${resp.email}'s role to ${resp.roleName}`
              );
              if (memberDetail) {
                const newMemberDetail = { ...resp, teams: memberDetail.teams };
                this.updateMemberDetail(newMemberDetail);
              }
            }),
            catchError((error: HttpErrorResponse) => {
              this.setUpdateMemberLoading(false);
              this.setUpdateMemberError(`${error.statusText}: ${error.status}`);
              return EMPTY;
            })
          );
        })
      ),
      { defaultValue: null }
    );
  }

  clearState() {
    this.state.next(initialState);
  }

  retrieveMemberDetail(orgSlug: string, memberId: number) {
    return lastValueFrom(
      this.membersService
        .retrieve(orgSlug, memberId)
        .pipe(tap((memberDetail) => this.setMemberDetail(memberDetail)))
    );
  }

  updateMemberDetail(member: Member) {
    this.setMemberDetail(member);
  }

  private setUpdateMemberError(errorMessage: string) {
    this.state.next({
      ...this.state.getValue(),
      updateMemberError: errorMessage,
    });
  }

  private setUpdateMemberLoading(loading: boolean) {
    this.state.next({ ...this.state.getValue(), updateMemberLoading: loading });
  }

  private setMemberDetail(member: Member) {
    this.state.next({
      ...this.state.getValue(),
      memberDetail: member,
    });
  }
}
