import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { Comment } from "./comments.interfaces";
import { Environment } from "../organizations/organizations.interface";

@Injectable({
  providedIn: "root",
})
export class CommentsAPIService {
  readonly url = "/comments/";

  constructor(protected http: HttpClient) {}

  list(issueId: number) {
    return this.http.get<Environment[]>(this.listURL(issueId));
  }

  update(issueId: number, commentId: number, comment: Comment) {
    return this.http.patch(this.detailURL(issueId, commentId), comment);
  }

  destroy(issueId: number, commentId: number) {
    return this.http.delete(this.detailURL(issueId, commentId));
  }

  protected listURL(issueId: number) {
    return `${baseUrl}/issues/${issueId}${this.url}`;
  }

  protected detailURL(issueId: number, commentId: number) {
    return `${baseUrl}/issues/${issueId}${this.url}${commentId}/`;
  }
}
