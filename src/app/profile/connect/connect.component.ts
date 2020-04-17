import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { GlitchTipOAuthService } from "src/app/api/oauth/oauth.service";
import { catchError, tap } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY } from "rxjs";

/**
 * The connect component connects an oauth provider to an existing user
 * and redirects back to the profile page
 */
@Component({
  templateUrl: "./connect.component.html",
  styleUrls: ["./connect.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectComponent implements OnInit {
  constructor(
    private oauthService: GlitchTipOAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const fragment = this.route.snapshot.fragment;
    const provider = this.route.snapshot.paramMap.get("provider");
    const errorText = "Bad Request: Unable to connect to ";

    if (fragment) {
      const accessToken = new URLSearchParams(fragment).get("access_token");
      if (accessToken) {
        if (provider === "gitlab") {
          this.oauthService
            .gitlabConnect(accessToken)
            .pipe(
              tap(() => this.router.navigate(["../../"])),
              catchError((error: HttpErrorResponse) => {
                if (error.status === 400) {
                  this.snackBar.open(errorText, provider);
                  console.warn(error);
                }
                return EMPTY;
              })
            )
            .toPromise();
        } else if (provider === "google") {
          this.oauthService
            .googleConnect(accessToken)
            .pipe(
              tap(() => this.router.navigate(["../../"])),
              catchError((error: HttpErrorResponse) => {
                if (error.status === 400) {
                  this.snackBar.open(errorText, provider);
                  console.warn(error);
                }
                return EMPTY;
              })
            )
            .toPromise();
        } else if (provider === "microsoft") {
          this.oauthService
            .microsoftConnect(accessToken)
            .pipe(
              tap(() => this.router.navigate(["../../"])),
              catchError((error: HttpErrorResponse) => {
                if (error.status === 400) {
                  this.snackBar.open(errorText, provider);
                  console.warn(error);
                }
                return EMPTY;
              })
            )
            .toPromise();
        }
      }
    }
  }
}
