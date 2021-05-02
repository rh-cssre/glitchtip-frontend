import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthTokensService } from "./auth-tokens.service";

@Component({
  selector: "app-auth-tokens",
  templateUrl: "./auth-tokens.component.html",
  styleUrls: ["./auth-tokens.component.scss"],
})
export class AuthTokensComponent implements OnInit, OnDestroy {
  authTokens$ = this.authTokensService.apiTokens$;
  deleteLoading$ = this.authTokensService.deleteLoading$;
  initialLoad$ = this.authTokensService.initialLoad$;

  constructor(private authTokensService: AuthTokensService) { }

  ngOnInit(): void {
    this.authTokensService.loadAuthTokens();
  }

  ngOnDestroy(): void {
    this.authTokensService.clear();
  }

  deleteAuthToken(id: string) {
    this.authTokensService.deleteAuthToken(id);
  }
}
