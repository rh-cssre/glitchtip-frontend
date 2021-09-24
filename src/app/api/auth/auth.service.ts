import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";

export interface AuthState {
  isLoggedIn: boolean;
  redirectUrl: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  redirectUrl: "",
};

@Injectable({
  providedIn: "root",
})
export class AuthService extends StatefulService<AuthState> {
  isLoggedIn = this.getState$.pipe(map((data) => data.isLoggedIn));
  private readonly url = "/rest-auth/logout/";

  constructor(private http: HttpClient, private router: Router) {
    super(initialState);
    const authData = localStorage.getItem("auth");
    if (authData) {
      const auth = JSON.parse(authData);
      this.setState({
        isLoggedIn: auth.isLoggedIn,
        redirectUrl: auth.redirectUrl,
      });
    }
  }

  setAuth(data: AuthState) {
    this.state.next(data);
    localStorage.setItem("auth", JSON.stringify(data));
  }

  setRedirectUrl(url: string) {
    this.setAuth({
      isLoggedIn: false,
      redirectUrl: url,
    });
  }

  afterLogin(redirect = true) {
    const redirectUrl = this.state.getValue().redirectUrl;
    this.setAuth({ isLoggedIn: true, redirectUrl: "" });
    if (redirect) {
      this.router.navigateByUrl(redirectUrl);
    }
  }

  /** Log out user from the backend  */
  logout() {
    this.http
      .post(this.url, null)
      .pipe(tap(() => this.removeAuth()))
      .toPromise();
  }

  passwordReset(email: string) {
    const data = { email };
    const url = "/rest-auth/password/reset/";
    return this.http.post(url, data);
  }

  /** Explicitly log out */
  removeAuth() {
    this.clearAuth();
    window.location.href = "/login";
  }

  /** Run if server thinks user is logged out. */
  expireAuth() {
    this.clearAuth();
    this.setRedirectUrl(window.location.pathname);
    window.location.href = "/login";
  }

  private clearAuth() {
    this.clearState();
    localStorage.clear();
  }
}
