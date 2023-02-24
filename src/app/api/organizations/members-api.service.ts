import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import {
  Member,
  MemberDetail,
  MemberUpdateData,
  OrganizationMembersRequest,
} from "./organizations.interface";

@Injectable({
  providedIn: "root",
})
export class MembersAPIService {
  readonly url = `/members/`;
  constructor(protected http: HttpClient) {}

  list(orgSlug: string) {
    return this.http.get<Member[]>(this.listURL(orgSlug));
  }

  retrieve(orgSlug: string, memberId: number) {
    return this.http.get<MemberDetail>(this.detailURL(orgSlug, memberId));
  }

  update(orgSlug: string, memberId: number, memberData: MemberUpdateData) {
    return this.http.put<Member>(this.detailURL(orgSlug, memberId), memberData);
  }

  destroy(orgSlug: string, memberId: number) {
    return this.http.delete(this.detailURL(orgSlug, memberId));
  }

  makeOrgOwner(orgSlug: string, memberId: number) {
    return this.http.post<Member>(
      this.detailURL(orgSlug, memberId) + "set_owner/",
      null
    );
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
