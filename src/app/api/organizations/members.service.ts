import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, EMPTY, combineLatest, Observable } from "rxjs";
import {
  mergeMap,
  map,
  tap,
  catchError,
  exhaustMap,
  take,
} from "rxjs/operators";
import { OrganizationsService } from "./organizations.service";
import { baseUrl } from "../../constants";
import { Member, MemberSelector } from "./organizations.interface";
import { UserService } from "../user/user.service";

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
  private readonly url = baseUrl + "/organizations/";
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
    this.organizationsService.organizationMembers$,
    this.loadingResendInvite$,
    this.sentResendInvite$,
    this.userService.activeUserEmail$,
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

  constructor(
    private organizationsService: OrganizationsService,
    private userService: UserService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  /** Send another invite to already invited org member */
  resendInvite(memberId: number) {
    const data = { reinvite: 1 };
    this.setLoadingResendInvite(memberId);
    return this.organizationsService.activeOrganizationSlug$
      .pipe(
        take(1),
        mergeMap((orgSlug) =>
          this.http.put(`${this.url}${orgSlug}/members/${memberId}/`, data)
        ),
        tap(() => this.setResendInviteSuccess(memberId)),
        catchError(() => {
          this.clearLoadingResendInvite();
          return EMPTY;
        })
      )
      .toPromise();
  }

  /** Remove member for active organization. */
  removeMember(member: Member) {
    return this.organizationsService.activeOrganizationSlug$
      .pipe(
        take(1),
        exhaustMap((orgSlug) => {
          return this.http
            .delete(`${this.url}${orgSlug}/members/${member.id}/`)
            .pipe(
              exhaustMap(() => {
                this.snackBar.open(
                  `Successfully removed ${member.email} from organization`
                );
                if (orgSlug) {
                  return this.organizationsService.retrieveOrganizationMembers(
                    orgSlug
                  );
                }
                return EMPTY;
              }),
              catchError((err) => {
                let message = `Error attempting to remove ${member.email} from organization`;
                if (
                  err instanceof HttpErrorResponse &&
                  err.status === 403 &&
                  err.error?.detail
                ) {
                  message += `. ${err.error.detail}"`;
                }
                this.snackBar.open(message);
                return EMPTY;
              })
            );
        })
      )
      .toPromise();
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
