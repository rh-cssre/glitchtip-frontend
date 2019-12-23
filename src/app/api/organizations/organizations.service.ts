import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest } from "rxjs";
import { tap, map } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { Organization, OrganizationDetail } from "./organizations.interface";
import { Router } from "@angular/router";

interface OrganizationsState {
  organizations: Organization[];
  activeOrganizationId: number | null;
  activeOrganization: OrganizationDetail | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  activeOrganizationId: null,
  activeOrganization: null
};

@Injectable({
  providedIn: "root"
})
export class OrganizationsService {
  private readonly organizationsState = new BehaviorSubject<OrganizationsState>(
    initialState
  );
  private readonly getState$ = this.organizationsState.asObservable();
  private readonly url = baseUrl + "/organizations/";

  organizations$ = this.getState$.pipe(map(data => data.organizations));
  activeOrganization$ = this.getState$.pipe(
    map(data => data.activeOrganizationId),
    tap(organization =>
      console.log("active organization number: ", organization)
    )
  );
  activeOrganizationDetail$ = combineLatest([
    this.organizations$,
    this.activeOrganization$
  ]).pipe(
    map(([organizations, activeOrganization]) =>
      organizations.find(organization => organization.id === activeOrganization)
    )
  );

  constructor(private http: HttpClient, private router: Router) {}

  createOrganization(name: string) {
    const data = {
      name
    };
    return this.http.post<Organization>(this.url, data);
  }

  retrieveOrganizations() {
    return this.http.get<Organization[]>(this.url).pipe(
      tap(organizations => {
        this.setOrganizations(organizations),
          console.log("retrieveOrganizations: ", organizations);
      })
    );
  }

  changeActiveOrganization(activeOrganizationId: number) {
    this.setActiveOrganizationId(activeOrganizationId);
    const organization = this.organizationsState
      .getValue()
      .organizations.find(org => org.id === activeOrganizationId);
    this.getOrganizationDetail(organization.slug)
      .pipe(
        tap(org => this.router.navigate(["organizations", org.slug, "issues"]))
      )
      .toPromise();
  }

  updateOrganization() {
    console.log("TODO: update org");
  }

  deleteOrganization(slug: string) {
    const url = `${this.url}${slug}/`;
    return this.http.delete(url);
  }

  private setOrganizations(organizations: Organization[]) {
    this.organizationsState.next({
      ...this.organizationsState.getValue(),
      organizations
    });
  }

  private setActiveOrganizationId(activeOrganizationId: number) {
    this.organizationsState.next({
      ...this.organizationsState.getValue(),
      activeOrganizationId
    });
  }

  private setActiveOrganization(organization: OrganizationDetail) {
    this.organizationsState.next({
      ...this.organizationsState.getValue(),
      activeOrganization: organization
    });
  }

  private getOrganizationDetail(slug: string) {
    return this.http
      .get<OrganizationDetail>(`${this.url}${slug}/`)
      .pipe(tap(organization => this.setActiveOrganization(organization)));
  }
}
