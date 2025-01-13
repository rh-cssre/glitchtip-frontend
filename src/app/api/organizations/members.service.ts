import { Injectable, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  BehaviorSubject,
  EMPTY,
  lastValueFrom,
  combineLatest,
  Observable,
} from "rxjs";
import {
  mergeMap,
  map,
  tap,
  catchError,
  exhaustMap,
  take,
} from "rxjs/operators";
import { MembersAPIService } from "./members-api.service";
import { Member, MemberSelector } from "./organizations.interface";
import { UserService } from "../user/user.service";
import { OrganizationsService } from "../organizations.service";
import { OrganizationDetailService } from "./organization-detail.service";
import { toObservable } from "@angular/core/rxjs-interop";

interface MembersState {
  loadingResendInvite: number | null;
  sentResendInvite: number[];
}

const initialState: MembersState = {
  loadingResendInvite: null,
  sentResendInvite: [],
};

@Injectable({ providedIn: "root" })
export class MembersService {
  private membersAPIService = inject(MembersAPIService);
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  private readonly state = new BehaviorSubject<MembersState>(initialState);
  private readonly getState$ = this.state.asObservable();
  readonly loadingResendInvite$ = this.getState$.pipe(
    map((state) => state.loadingResendInvite)
  );
  readonly sentResendInvite$ = this.getState$.pipe(
    map((state) => state.sentResendInvite)
  );
  /** Organization members with computed loading/success data */
  readonly members$: Observable<MemberSelector[]> = combineLatest([
    this.organizationDetailService.organizationMembers$,
    this.loadingResendInvite$,
    this.sentResendInvite$,
    toObservable(this.userService.activeUserEmail),
  ]).pipe(
    map(([members, loadingResendInvite, sentResendInvite, activeUserEmail]) => {
      return members.map((member) => {
        return {
          ...member,
          loadingResendInvite: member.id === loadingResendInvite ? true : false,
          sentResendInvite: sentResendInvite.includes(member.id) ? true : false,
          isMe: member.email === activeUserEmail ? true : false,
        };
      });
    })
  );

  /** Send another invite to already invited org member */
  resendInvite(member: Member) {
    this.setLoadingResendInvite(member.id);
    const data = {
      email: member.email,
      orgRole: member.role,
      teamRoles: [],
      reinvite: true,
    };
    lastValueFrom(
      this.organizationsService.activeOrganizationSlug$.pipe(
        take(1),
        mergeMap((orgSlug) =>
          this.membersAPIService.inviteUser(orgSlug!, data)
        ),
        tap(() => this.setResendInviteSuccess(member.id)),
        catchError(() => {
          this.clearLoadingResendInvite();
          return EMPTY;
        })
      )
    );
  }

  /** Remove member for active organization. */
  removeMember(member: Member) {
    lastValueFrom(
      this.organizationsService.activeOrganizationSlug$.pipe(
        take(1),
        exhaustMap((orgSlug) => {
          return this.membersAPIService.destroy(orgSlug!, member.id).pipe(
            exhaustMap(() => {
              this.snackBar.open(
                `Successfully removed ${member.email} from organization`
              );
              if (orgSlug) {
                return this.organizationDetailService.retrieveOrganizationMembers(
                  orgSlug
                );
              }
              return EMPTY;
            }),
            catchError((err) => {
              let message = `Error attempting to remove ${member.email} from organization`;
              if (err instanceof HttpErrorResponse) {
                if (err.status === 403 && err.error?.detail) {
                  message += `. ${err.error.detail}`;
                } else if (err.status === 400 && err.error?.message) {
                  message += `. ${err.error.message}`;
                }
              }
              this.snackBar.open(message);
              return EMPTY;
            })
          );
        })
      ),
      { defaultValue: null }
    );
  }

  private setLoadingResendInvite(memberId: number) {
    this.state.next({
      ...this.state.getValue(),
      loadingResendInvite: memberId,
    });
  }

  private setResendInviteSuccess(memberId: number) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      loadingResendInvite: null,
      sentResendInvite: [...state.sentResendInvite, memberId],
    });
  }

  private clearLoadingResendInvite() {
    this.state.next({ ...this.state.getValue(), loadingResendInvite: null });
  }
}
