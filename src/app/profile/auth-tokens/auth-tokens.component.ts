import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthTokensService } from "./auth-tokens.service";

@Component({
  selector: "gt-auth-tokens",
  templateUrl: "./auth-tokens.component.html",
  styleUrls: ["./auth-tokens.component.scss"],
})
export class AuthTokensComponent implements OnInit, OnDestroy {
  authTokens$ = this.authTokensService.apiTokens$;
  deleteLoading$ = this.authTokensService.deleteLoading$;
  initialLoad$ = this.authTokensService.initialLoad$;

  constructor(private authTokensService: AuthTokensService) {}

  ngOnInit(): void {
    this.authTokensService.loadAuthTokens();
  }

  ngOnDestroy(): void {
    this.authTokensService.clear();
  }

  deleteAuthToken(id: string) {
    if (window.confirm("Are you sure you want to delete this authentication token?"))
      this.authTokensService.deleteAuthToken(id);
  }
}
