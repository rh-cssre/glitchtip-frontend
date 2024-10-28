import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";
import { toObservable } from "@angular/core/rxjs-interop";
import { map, tap } from "rxjs/operators";
import { AcceptInviteService } from "src/app/api/accept/accept-invite.service";
import { AuthService } from "src/app/auth.service";

@Component({
  selector: "gt-accept-invite",
  templateUrl: "./accept-invite.component.html",
  styleUrls: ["./accept-invite.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink, AsyncPipe],
})
export class AcceptInviteComponent implements OnInit {
  isLoggedIn$ = toObservable(this.authService.isAuthenticated);
  params$ = this.activatedRoute.params.pipe(
    map((params) => ({
      memberId: params.memberId,
      token: params.token,
    })),
  );
  nextUrl$ = this.params$.pipe(
    map(({ memberId, token }) => `/accept/${memberId}/${token}`),
  );
  acceptInfo$ = this.acceptService.acceptInfo$;
  alreadyInOrg$ = this.acceptService.alreadyInOrg$;

  constructor(
    private authService: AuthService,
    private acceptService: AcceptInviteService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.params$
      .pipe(
        tap(({ memberId, token }) => {
          this.acceptService.getAcceptInviteDetails(memberId, token);
        }),
      )
      .subscribe();
  }

  onSubmit() {
    this.params$
      .pipe(
        tap(({ memberId, token }) => {
          this.acceptService.acceptInvite(memberId, token);
        }),
      )
      .subscribe();
  }

  logout() {
    this.authService.logout();
  }
}
