import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { User } from "./user.interfaces";

@Injectable({
  providedIn: "root",
})
export class UserAPIService {
  readonly url = `${baseUrl}/users/me/`;
  constructor(protected http: HttpClient) {}

  retrieve() {
    return this.http.get<User>(this.url);
  }

  update(user: Partial<User>) {
    return this.http.put<User>(this.url, user);
  }

  destroy() {
    return this.http.delete(this.url);
  }
}
