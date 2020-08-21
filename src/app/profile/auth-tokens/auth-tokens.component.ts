import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { AuthTokensService } from "./auth-tokens.service";

@Component({
  selector: "app-auth-tokens",
  templateUrl: "./auth-tokens.component.html",
  styleUrls: ["./auth-tokens.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthTokensComponent implements OnInit, OnDestroy {
  authTokens$ = this.authTokensService.apiTokens$;
  constructor(private authTokensService: AuthTokensService) {}

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
