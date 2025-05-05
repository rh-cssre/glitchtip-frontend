import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { EMPTY, map } from "rxjs";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";
import {
  EventDetail,
  IssueDetail,
  IssueStatus,
  IssueTags,
  UpdateStatusResponse,
} from "src/app/issues/interfaces";
import { normalizeID } from "../shared-api.utils";

@Injectable({
  providedIn: "root",
})
export class IssuesAPIService extends APIBaseService {
  protected http: HttpClient;

  readonly url = baseUrl + "/issues/";
  constructor() {
    const http = inject(HttpClient);

    super(http);

    this.http = http;
  }

  list(slug1?: string, slug2?: string) {
    return EMPTY;
  }

  retrieve(id: string) {
    return this.http.get<IssueDetail>(this.detailURL(id)).pipe(
      map((issueDetail) => {
        issueDetail.project.id = normalizeID(issueDetail.project.id);
        return issueDetail;
      }),
    );
  }

  update(status: IssueStatus, orgSlug: string, id: number) {
    return this.http.put<UpdateStatusResponse>(this.orgIssuesUrl(orgSlug, id), {
      status,
    });
  }

  destroy(id: string) {
    return this.http.delete(this.detailURL(id));
  }

  retrieveLatestEvent(issueId: number) {
    const url = `${this.url}${issueId}/events/latest/`;
    return this.http.get<EventDetail>(url);
  }

  retrieveEvent(issueId: number, eventID: string) {
    const url = `${this.url}${issueId}/events/${eventID}/`;
    return this.http.get<EventDetail>(url);
  }

  retrieveTags(issueId: string, query?: string) {
    const url = `${this.url}${issueId}/tags/`;
    let params = new HttpParams();
    if (query) {
      params = params.append("query", query);
    }
    return this.http.get<IssueTags[]>(url, { params });
  }

  orgIssuesUrl(orgSlug: string, issueId?: number) {
    let url = `${baseUrl}/organizations/${orgSlug}/issues/`;
    return issueId ? url + issueId + "/" : url;
  }
}
