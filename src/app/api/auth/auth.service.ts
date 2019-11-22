import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

interface AuthState {
  token: string | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

const initialState: AuthState = {
  token: null,
  email: null,
  first_name: null,
  last_name: null
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private authData = new BehaviorSubject<AuthState>(initialState);
  data = this.authData.asObservable();
  isLoggedIn = this.data.pipe(map(data => Boolean(data.token)));
  getAuthToken = this.authData.pipe(map(auth => auth.token));

  constructor() {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const auth = JSON.parse(authData);
      if (auth.token) {
        this.setAuth({
          token: auth.token
        });
      }
    }
  }

  setAuth(data: AuthState) {
    this.authData.next(data);
    localStorage.setItem("auth", JSON.stringify(data));
  }

  clearAuth() {
    this.authData.next(initialState);
    localStorage.clear();
  }
}
