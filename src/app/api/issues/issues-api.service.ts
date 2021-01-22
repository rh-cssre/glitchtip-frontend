import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";
import {
  EventDetail,
  Issue,
  IssueDetail,
  IssueStatus,
  UpdateStatusResponse,
} from "src/app/issues/interfaces";

@Injectable({
  providedIn: "root",
})
export class IssuesAPIService extends APIBaseService {
  readonly url = baseUrl + "/issues/";
  constructor(protected http: HttpClient) {
    super(http);
  }

  list(
    organizationSlug?: string,
    cursor?: string,
    query?: string,
    project?: string[] | null,
    start?: string,
    end?: string,
    sort?: string
  ) {
    const url = organizationSlug
      ? `${baseUrl}/organizations/${organizationSlug}/issues/`
      : this.url;
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    if (query) {
      httpParams = httpParams.set("query", query);
    }
    if (project) {
      project.forEach((id) => {
        httpParams = httpParams.append("project", id);
      });
    }
    if (start && end) {
      httpParams = httpParams.set("start", start);
      httpParams = httpParams.set("end", end);
    }
    if (sort) {
      httpParams = httpParams.set("sort", sort);
    }
    return this.http.get<Issue[]>(url, {
      observe: "response",
      params: httpParams,
    });
  }

  retrieve(id: string) {
    return this.http.get<IssueDetail>(this.detailURL(id));
  }

  update(ids: number[], status: IssueStatus) {
    const params = {
      id: ids.map((id) => id.toString()),
    };
    return this.http.put<UpdateStatusResponse>(
      this.url,
      { status },
      { params }
    );
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
}
