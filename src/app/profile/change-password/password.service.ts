import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

interface ChangePassword {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

const baseUrl = "/rest-auth/password";

@Injectable({
  providedIn: "root",
})
export class PasswordService {
  constructor(private http: HttpClient) {}

  changePassword(
    // tslint:disable: variable-name
    old_password: string,
    new_password1: string,
    new_password2: string
  ) {
    const url = baseUrl + "/change/";
    const data: ChangePassword = {
      old_password,
      new_password1,
      new_password2,
    };
    return this.http.post(url, data);
  }
}
