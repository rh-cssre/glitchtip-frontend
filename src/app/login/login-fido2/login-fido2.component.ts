import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
// import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../login.service";

@Component({
  selector: "gt-login-fido2",
  templateUrl: "./login-fido2.component.html",
  styleUrls: ["./login-fido2.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFido2Component implements OnInit {


  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.authenticateFIDO2().subscribe()
  }

  
}

// private loginService: LoginService