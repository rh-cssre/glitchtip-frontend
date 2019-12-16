import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest } from "rxjs";
import { tap, shareReplay, catchError, map } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { Organization } from "./organizations.interface";

@Injectable({
  providedIn: "root"
})
export class OrganizationsService {
  private organizations = new BehaviorSubject<Organization[]>([]);
  getOrganizations = this.organizations.asObservable();

  private organizationSelectedAction = new BehaviorSubject<string>("");

  url = baseUrl + "/organizations/";

  organizations$ = this.http.get<Organization[]>(this.url).pipe(
    tap(data => console.log("getOrganizations: ", JSON.stringify(data))),
    shareReplay(),
    catchError(err => "Error Alert")
  );

  selectedOrganization$ = combineLatest([
    this.organizationSelectedAction,
    this.organizations$
  ]).pipe(
    map(([selectedOrganizationSlug, organizations]) =>
      organizations.find(
        organization => organization.slug === selectedOrganizationSlug
      )
    ),
    tap(product => console.log("selectedProduct", product)),
    shareReplay(1),
    catchError(err => "oops")
  );

  constructor(private http: HttpClient) {}

  createOrganization(name: string) {
    const data = {
      name
    };
    return this.http
      .post<Organization>(this.url, data)
      .pipe(tap(newOrganziaton => this.addOneOrganization(newOrganziaton)));
  }

  retrieveOrganizationDetail(slug: string) {
    const url = `${this.url}${slug}/`;
    return this.http.get<Organization>(url);
  }

  changeSelectedOrganization(slug: string | null): void {
    this.organizationSelectedAction.next(slug);
    console.log("slug: ", slug);
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
