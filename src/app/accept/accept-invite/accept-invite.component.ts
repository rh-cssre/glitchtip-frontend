import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { AuthService } from "src/app/api/auth/auth.service";
import { AcceptInviteService } from "src/app/api/accept/accept-invite.service";
import { ActivatedRoute } from "@angular/router";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "gt-accept-invite",
  templateUrl: "./accept-invite.component.html",
  styleUrls: ["./accept-invite.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptInviteComponent implements OnInit {
  isLoggedIn$ = this.authService.isLoggedIn;
  params$ = this.activatedRoute.params.pipe(
    map((params) => ({
      memberId: params.memberId,
      token: params.token,
    }))
  );
  nextUrl$ = this.params$.pipe(
    map(({ memberId, token }) => `/accept/${memberId}/${token}`)
  );
  acceptInfo$ = this.acceptService.acceptInfo$;
  alreadyInOrg$ = this.acceptService.alreadyInOrg$;

  constructor(
    private authService: AuthService,
    private acceptService: AcceptInviteService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.params$
      .pipe(
        tap(({ memberId, token }) => {
          this.acceptService.getAcceptInviteDetails(memberId, token);
        })
      )
      .subscribe();
  }

  onSubmit() {
    this.params$
      .pipe(
        tap(({ memberId, token }) => {
          this.acceptService.acceptInvite(memberId, token);
        })
      )
      .subscribe();
  }

  logout() {
    this.authService.logout();
  }
}
