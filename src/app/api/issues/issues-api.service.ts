import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";
import {
  APIIssue,
  APIIssueDetail,
  EventDetail,
  Issue,
  IssueDetail,
  IssueStatus,
  IssueTags,
  UpdateStatusResponse,
} from "src/app/issues/interfaces";
import { Params } from "@angular/router";

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
    project?: number[] | null,
    start?: string,
    end?: string,
    sort?: string,
    environment?: string
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
    if (start) {
      httpParams = httpParams.set("start", start);
    }
    if (end) {
      httpParams = httpParams.set("end", end);
    }
    if (sort) {
      httpParams = httpParams.set("sort", sort);
    }
    if (environment) {
      httpParams = httpParams.set("environment", environment);
    }
    return this.http
      .get<APIIssue[]>(url, {
        observe: "response",
        params: httpParams,
      })
      .pipe(
        map((response) => {
          const issues = response.body!.map((apiIssue) => {
            return {
              ...apiIssue,
              project: {
                ...apiIssue.project,
                id: parseInt(apiIssue.project.id, 10),
              },
            } as Issue;
          });
          return response.clone({
            body: issues
          });
        })
      );
  }

  retrieve(id: string) {
    return this.http.get<APIIssueDetail>(this.detailURL(id)).pipe(
      map((apiIssueDetail) => {
        return {
          ...apiIssueDetail,
          project: {
            ...apiIssueDetail.project,
            id: parseInt(apiIssueDetail.project.id, 10),
          },
        } as IssueDetail;
      })
    );
  }

  update(
    status: IssueStatus,
    ids: number[],
    orgSlug?: string,
    projectId?: string,
    query?: string
  ) {
    let params: Params;
    let updateUrl = `${baseUrl}/organizations/${orgSlug}/issues/`;

    if (orgSlug && projectId && query) {
      params = {
        project: projectId,
        query,
      };
    } else if (orgSlug && projectId) {
      params = {
        project: projectId,
      };
    } else {
      updateUrl = this.url;
      params = {
        id: ids.map((id) => id.toString()),
      };
    }
    return this.http.put<UpdateStatusResponse>(
      updateUrl,
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

  retrieveTags(issueId: string, query?: string) {
    const url = `${this.url}${issueId}/tags/`;
    let params = new HttpParams();
    if (query) {
      params = params.append("query", query);
    }
    return this.http.get<IssueTags[]>(url, { params });
  }
}
