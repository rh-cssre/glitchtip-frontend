import { HttpClient, HttpParams } from "@angular/common/http";
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

  list(issueId: number, cursor?: string) {
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    return this.http.get<Comment[]>(this.listURL(issueId), {
      params: httpParams,
    });
  }

  update(issueId: number, commentId: number, comment: Comment) {
    return this.http.patch<Comment>(
      this.detailURL(issueId, commentId),
      comment
    );
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
