import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

export interface AuthState {
  key: string | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

const initialState: AuthState = {
  key: null,
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
  isLoggedIn = this.data.pipe(map(data => Boolean(data.key)));
  getAuthToken = this.authData.pipe(map(auth => auth.key));

  constructor() {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const auth = JSON.parse(authData);
      if (auth.token) {
        this.setAuth({
          key: auth.key
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
