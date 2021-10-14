import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { AuthService, AuthState } from "../api/auth/auth.service";

const baseUrl = "/rest-auth";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  register(email: string, password1: string, password2: string, tags: string) {
    const url = baseUrl + "/registration/";
    const data = {
      email,
      password1,
      password2,
      tags
    };
    return this.http.post<AuthState>(url, data).pipe(tap(() => this.setAuth()));
  }

  setAuth() {
    this.authService.afterLogin();
  }
}
