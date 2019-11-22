import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { AuthService, AuthState } from "../api/auth/auth.service";

const baseUrl = "/rest-auth";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  login(email: string, password: string) {
    const url = baseUrl + "/login/";
    const data = {
      email,
      password
    };
    return this.http
      .post<AuthState>(url, data)
      .pipe(tap(resp => this.setAuth(resp)));
  }

  setAuth(resp: AuthState) {
    this.authService.setAuth(resp);
  }
}
