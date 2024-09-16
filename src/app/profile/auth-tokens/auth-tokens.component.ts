import { Component, OnInit } from "@angular/core";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
import { AuthTokensService, AuthTokensState } from "./auth-tokens.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { CopyInputComponent } from "../../shared/copy-input/copy-input.component";
import { MatDividerModule } from "@angular/material/divider";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-auth-tokens",
  templateUrl: "./auth-tokens.component.html",
  styleUrls: ["./auth-tokens.component.scss"],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatDividerModule,
    CopyInputComponent,
    LoadingButtonComponent,
    AsyncPipe
],
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
