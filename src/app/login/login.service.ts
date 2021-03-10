import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthState } from "../api/auth/auth.service";

const baseUrl = "/rest-auth";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const url = baseUrl + "/login/";
    const data = {
      email,
      password,
    };
    return this.http.post<AuthState>(url, data);
  }
}
