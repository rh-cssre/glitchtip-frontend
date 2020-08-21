import { Component, OnInit } from "@angular/core";
import { AuthTokensService } from "../auth-tokens.service";

@Component({
  selector: "app-new-token",
  templateUrl: "./new-token.component.html",
  styleUrls: ["./new-token.component.scss"],
})
export class NewTokenComponent implements OnInit {
  // Place form here

  constructor(private authTokensService: AuthTokensService) {}

  ngOnInit(): void {}

  fake() {
    this.authTokensService.createAuthToken("some token", []);
  }
}
