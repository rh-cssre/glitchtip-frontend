import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, combineLatest, EMPTY } from "rxjs";
import { map, take, exhaustMap, tap, catchError } from "rxjs/operators";
import { Member } from "./organizations.interface";
import { OrganizationsService } from "./organizations.service";
import { baseUrl } from "src/app/constants";

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
  private readonly url = baseUrl + "/organizations/";
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
    private organizationsService: OrganizationsService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  /** Update member teams and/or permissions */
  updateMember(updatedRole: string) {
    this.setUpdateMemberLoading(true);
    return combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.memberDetail$,
    ])
      .pipe(
        take(1),
        exhaustMap(([orgSlug, memberDetail]) => {
          const data = {
            ...memberDetail,
            role: updatedRole,
          };
          const url = `${this.url}${orgSlug}/members/${memberDetail?.id}/`;
          return this.http.put<Member>(url, data).pipe(
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
      )
      .toPromise();
  }

  clearState() {
    this.state.next(initialState);
  }

  retrieveMemberDetail(orgSlug: string, memberId: string) {
    const url = `${this.url}${orgSlug}/members/${memberId}/`;
    return this.http
      .get<Member>(url)
      .pipe(tap((memberDetail) => this.setMemberDetail(memberDetail)));
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
