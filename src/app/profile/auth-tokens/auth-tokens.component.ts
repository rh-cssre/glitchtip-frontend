import { Component, OnInit } from "@angular/core";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
import { AuthTokensService, AuthTokensState } from "./auth-tokens.service";

@Component({
  selector: "gt-auth-tokens",
  templateUrl: "./auth-tokens.component.html",
  styleUrls: ["./auth-tokens.component.scss"],
})
export class AuthTokensComponent
  extends StatefulBaseComponent<AuthTokensState, AuthTokensService>
  implements OnInit
{
  authTokens$ = this.service.apiTokens$;
  deleteLoading$ = this.service.deleteLoading$;
  initialLoad$ = this.service.initialLoad$;

  constructor(protected service: AuthTokensService) {
    super(service);
  }

  ngOnInit(): void {
    this.service.loadAuthTokens();
  }

  deleteAuthToken(id: string) {
    if (
      window.confirm(
        "Are you sure you want to delete this authentication token?"
      )
    )
      this.service.deleteAuthToken(id);
  }
}
