import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { Member, OrganizationMembersRequest } from "./organizations.interface";

@Injectable({
  providedIn: "root",
})
export class MembersAPIService {
  readonly url = `/members/`;
  constructor(protected http: HttpClient) {}

  list(orgSlug: string) {
    return this.http.get<Member[]>(this.listURL(orgSlug));
  }

  destroy(orgSlug: string, memberId: number) {
    return this.http.delete(this.detailURL(orgSlug, memberId));
  }

  inviteUser(orgSlug: string, data: OrganizationMembersRequest) {
    return this.http.post<Member>(this.listURL(orgSlug), data);
  }

  resendInvite(orgSlug: string, memberId: number) {
    return this.http.put<Member>(this.detailURL(orgSlug, memberId), {
      reinvite: 1,
    });
  }

  private listURL(organizationSlug: string) {
    return `${baseUrl}/organizations/${organizationSlug}${this.url}`;
  }

  private detailURL(orgSlug: string, memberId: number) {
    return `${this.listURL(orgSlug)}${memberId}/`;
  }
}
