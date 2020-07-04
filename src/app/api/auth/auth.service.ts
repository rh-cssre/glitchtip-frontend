import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

export interface AuthState {
  isLoggedIn: boolean;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  email: null,
  first_name: null,
  last_name: null,
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authData = new BehaviorSubject<AuthState>(initialState);
  data = this.authData.asObservable();
  isLoggedIn = this.data.pipe(map((data) => data.isLoggedIn));
  private readonly url = "/rest-auth/logout/";

  constructor(private http: HttpClient) {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const auth = JSON.parse(authData);
      if (auth.isLoggedIn) {
        this.setAuth({
          isLoggedIn: auth.isLoggedIn,
        });
      }
    }
  }

  setAuth(data: AuthState) {
    this.authData.next(data);
    localStorage.setItem("auth", JSON.stringify(data));
  }

  /** Log out user from the backend  */
  logout() {
    this.http
      .post(this.url, null)
      .pipe(tap(() => this.removeAuth()))
      .toPromise();
  }

  /** Run if server thinks user is logged out. */
  removeAuth() {
    this.clearAuth();
    window.location.href = "/login";
  }

  private clearAuth() {
    this.authData.next(initialState);
    localStorage.clear();
  }
}
