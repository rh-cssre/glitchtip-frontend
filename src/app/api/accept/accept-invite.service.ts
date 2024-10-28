import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap, catchError, map } from "rxjs/operators";
import { EMPTY, BehaviorSubject, combineLatest } from "rxjs";
import { baseUrl } from "../../constants";
import { AcceptAPIResponse } from "./accept-invite.interfaces";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "../organizations/organizations.service";

interface AcceptState {
  acceptInfo: AcceptAPIResponse | null;
}

const initialState: AcceptState = {
  acceptInfo: null,
};

@Injectable({
  providedIn: "root",
})
export class AcceptInviteService {
  private readonly state = new BehaviorSubject<AcceptState>(initialState);
  readonly acceptInfo$ = this.state.pipe(map((state) => state.acceptInfo));
  readonly orgSlug$ = this.acceptInfo$.pipe(
    map((acceptInfo) => acceptInfo?.orgUser.organization.slug)
  );
  readonly alreadyInOrg$ = combineLatest([
    this.orgSlug$,
    this.orgService.organizations$,
  ]).pipe(
    map(([orgSlugToMatch, organizations]) => {
      if (orgSlugToMatch) {
        const match = organizations.find(
          (organization) => organization.slug === orgSlugToMatch
        );
        if (match) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    })
  );
  private readonly url = baseUrl + "/accept/";

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private orgService: OrganizationsService
  ) {}

  getAcceptInviteDetails(memberId: string, token: string) {
    this.getAcceptInvite(memberId, token)
      .pipe(
        tap((response) => {
          this.setAcceptInfo(response);
        }),
        catchError((error) => {
          if (error.error?.detail === "Not found.") {
            this.snackBar.open(`
              This invitation link expired or is invalid. Please
              issue a new invitation request.
            `);
          } else {
            this.snackBar.open(error.error?.detail);
          }
          this.router.navigate(["/"]);
          return EMPTY;
        })
      )
      .subscribe();
  }

  acceptInvite(memberId: string, token: string) {
    this.postAcceptInvite(memberId, token)
      .pipe(
        tap((response: AcceptAPIResponse) => {
          this.orgService.retrieveOrganizations().subscribe();
          this.snackBar.open(
            `You have been added to ${response.orgUser.organization.name}.`
          );
          this.router.navigate(["/"]);
        }),
        catchError((error) => {
          if (error.status === 500) {
            if ((error.error as string).includes("already exists")) {
              this.snackBar.open(`
                There was an error, probably because you tried to join an organization
                that you're already a part of.
              `);
            } else {
              this.snackBar.open(`
                There was an error. Try again later.
              `);
            }
          } else if (error.error?.detail === "Not found.") {
            this.snackBar.open(`
              This invitation link expired or is invalid. Please
              issue a new invitation request.
            `);
          } else {
            this.snackBar.open(error.error?.detail);
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  private getAcceptInvite(memberId: string, token: string) {
    return this.http.get<AcceptAPIResponse>(`${this.url}${memberId}/${token}/`);
  }

  private postAcceptInvite(memberId: string, token: string) {
    return this.http.post<AcceptAPIResponse>(
      `${this.url}${memberId}/${token}/`,
      {
        acceptInvite: true,
      }
    );
  }

  private setAcceptInfo(acceptInfo: AcceptAPIResponse) {
    this.state.next({ ...this.state.getValue(), acceptInfo });
  }
}
