import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MultiFactorAuthService } from "./multi-factor-auth.service";
import { Fido2Component } from "./fido2/fido2.component";
import { TOTPComponent } from "./totp/totp.component";
import { NgIf, AsyncPipe } from "@angular/common";

@Component({
    selector: "gt-multi-factor-auth",
    templateUrl: "./multi-factor-auth.component.html",
    styleUrls: ["./multi-factor-auth.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        TOTPComponent,
        Fido2Component,
        AsyncPipe,
    ],
})
export class MultiFactorAuthComponent implements OnInit {
  initialLoad$ = this.service.initialLoad$;
  constructor(private service: MultiFactorAuthService) {}

  ngOnInit() {
    this.service.getUserKeys().subscribe();
  }
}
