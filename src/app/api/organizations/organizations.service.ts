import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest, throwError } from "rxjs";
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
    catchError(this.handleError)
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
    catchError(this.handleError)
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

  private handleError(err) {
    console.error(err);
    return throwError("There was an error: ", err);
  }
}
