import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { Organization, OrganizationNew } from "./organizations.interface";

@Injectable({
  providedIn: "root"
})
export class OrganizationsService {
  private organizations = new BehaviorSubject<Organization[]>([]);
  getOrganizations = this.organizations.asObservable();
  url = baseUrl + "/organizations/";

  constructor(private http: HttpClient) {}

  createOrganization(organization: OrganizationNew) {
    return this.http
      .post<Organization>(this.url, organization)
      .pipe(tap(newOrganziaton => this.addOneOrganization(newOrganziaton)));
  }

  retrieveOrganizations() {
    return this.http
      .get<Organization[]>(this.url)
      .pipe(tap(organizations => this.setOrganizations(organizations)));
  }

  retrieveOrganizationDetail(slug: string) {
    const url = `${this.url}${slug}/`;
    return this.http.get<Organization>(url);
  }

  deleteOrganization(slug: string) {
    const url = `${this.url}${slug}/`;
    return this.http.delete(url);
  }

  setOrganizations(organizations: Organization[]) {
    this.organizations.next(organizations);
  }

  private addOneOrganization(organization: Organization) {
    const newOrganizations = this.organizations
      .getValue()
      .concat([organization]);
    this.organizations.next(newOrganizations);
  }
}
