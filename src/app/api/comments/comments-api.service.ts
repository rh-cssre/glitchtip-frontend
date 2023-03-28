import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { Comment } from "./comments.interfaces";

@Injectable({
  providedIn: "root",
})
export class CommentsAPIService {
  readonly url = "/comments/";

  constructor(protected http: HttpClient) {}

  create(issueId: number, text: string) {
    let data = {
      data: {
        text,
      },
    };
    return this.http.post<Comment>(this.listURL(issueId), data);
  }

  list(issueId: number) {
    return this.http.get<Comment[]>(this.listURL(issueId));
  }

  update(issueId: number, commentId: number, text: string) {
    let data = {
      data: {
        text,
      },
    };
    return this.http.put<Comment>(this.detailURL(issueId, commentId), data);
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
