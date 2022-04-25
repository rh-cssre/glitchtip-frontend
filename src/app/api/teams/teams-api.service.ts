import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIBaseService } from "../api-base.service";
import { baseUrl } from "../../constants";
import { Member } from "src/app/api/organizations/organizations.interface";
import { Team } from "./teams.interfaces";

@Injectable({
  providedIn: "root",
})
export class TeamsAPIService extends APIBaseService {
  readonly url = "/teams/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  create(orgSlug: string, teamSlug: string) {
    return this.http.post<Team>(this.listURL(orgSlug), { slug: teamSlug });
  }

  retrieve(orgSlug: string, teamSlug: string) {
    return this.http.get<Team>(this.detailURL(orgSlug, teamSlug));
  }

  list(organizationSlug: string) {
    return this.http.get<Team[]>(this.listURL(organizationSlug));
  }

  update(orgSlug: string, teamSlug: string, newTeamSlug: string) {
    return this.http.put<Team>(this.detailURL(orgSlug, teamSlug), {
      slug: newTeamSlug,
    });
  }

  destroy(orgSlug: string, teamSlug: string) {
    return this.http.delete(this.detailURL(orgSlug, teamSlug));
  }

  retrieveTeamMembers(orgSlug: string, teamSlug: string) {
    return this.http.get<Member[]>(this.teamMembersListURL(orgSlug, teamSlug));
  }

  addTeamMember(member: Member, orgSlug: string, teamSlug: string) {
    return this.http.post<Team>(
      this.teamMemberURL(member.id, orgSlug, teamSlug),
      member
    );
  }

  removeTeamMember(memberId: number, orgSlug: string, teamSlug: string) {
    return this.http.delete<Team>(
      this.teamMemberURL(memberId, orgSlug, teamSlug)
    );
  }

  joinTeam(orgSlug: string, teamSlug: string) {
    return this.http.post<Team>(this.userTeamURL(orgSlug, teamSlug), null);
  }

  leaveTeam(orgSlug: string, teamSlug: string) {
    return this.http.delete<Team>(this.userTeamURL(orgSlug, teamSlug));
  }

  private listURL(orgSlug: string) {
    return `${baseUrl}/organizations/${orgSlug}${this.url}`;
  }

  protected detailURL(orgSlug: string, teamSlug: string) {
    return `${baseUrl}${this.url}${orgSlug}/${teamSlug}/`;
  }

  private userTeamURL(orgSlug: string, teamSlug: string) {
    return `${baseUrl}/organizations/${orgSlug}/members/me/teams/${teamSlug}/`;
  }

  private teamMemberURL(memberId: number, orgSlug: string, teamSlug: string) {
    return `${baseUrl}/organizations/${orgSlug}/members/${memberId}/teams/${teamSlug}/`;
  }

  private teamMembersListURL(orgSlug: string, teamSlug: string) {
    return `${baseUrl}${this.url}${orgSlug}/${teamSlug}/members/`;
  }
}
