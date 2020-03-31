import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { GlitchTipOAuthService } from "src/app/api/oauth/oauth.service";
import { catchError, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";

/**
 * The connect component connects an oauth provider to an existing user
 * and redirects back to the profile page
 */
@Component({
  templateUrl: "./connect.component.html",
  styleUrls: ["./connect.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectComponent implements OnInit {
  constructor(
    private oauthService: GlitchTipOAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const fragment = this.route.snapshot.fragment;
    const query = this.route.snapshot.queryParamMap;
    const provider = this.route.snapshot.paramMap.get("provider");

    if (fragment) {
      const accessToken = new URLSearchParams(fragment).get("access_token");
      if (accessToken) {
        if (provider === "gitlab") {
          this.oauthService.gitlabLogin(accessToken).toPromise();
        } else if (provider === "google") {
          this.oauthService
            .googleConnect(accessToken)
            .pipe(
              tap(() => this.router.navigate(["../../"])),
              catchError((error: HttpErrorResponse) => {
                if (error.status === 400) {
                  console.log("error, maybe should open a snackbar?", error);
                }
                return EMPTY;
              })
            )
            .toPromise();
        } else if (provider === "microsoft") {
          this.oauthService.microsoftLogin(accessToken).toPromise();
        }
      }
    } else if (query) {
      const code = query.get("code");
      if (code) {
        if (provider === "github") {
          this.oauthService.githubLogin(code).toPromise();
        }
      }
    }
  }
}
