import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest, throwError, Subject } from "rxjs";
import { tap, shareReplay, catchError, map } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { Organization } from "./organizations.interface";

interface OrganizationsState {
  organizations: Organization[];
  activeOrganizationId: number | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  activeOrganizationId: null
};

@Injectable({
  providedIn: "root"
})
export class OrganizationsService {
  private organizationsState = new BehaviorSubject<OrganizationsState>(
    initialState
  );
  private getState$ = this.organizationsState.asObservable();
  private url = baseUrl + "/organizations/";

  organziations$ = this.getState$.pipe(map(data => data.organizations));
  activeOrganization$ = this.getState$.pipe(
    map(data => data.activeOrganizationId),
    tap(organization =>
      console.log("active organization number: ", organization)
    )
  );
  activeOrganizationDetail$ = combineLatest([
    this.organziations$,
    this.activeOrganization$
  ]).pipe(
    map(([organizations, activeOrganization]) =>
      organizations.find(organization => organization.id === activeOrganization)
    ),
    tap(organization =>
      console.log("active organization deets: ", organization)
    )
  );

  constructor(private http: HttpClient) {}

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

  retrieveOrganizationDetail(activeOrganizationId: number | null) {
    this.setActiveOrganizationId(activeOrganizationId);
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

  private setActiveOrganizationId(activeOrganizationId: number | null) {
    console.log("setActiveOrganizationId ", activeOrganizationId);
    this.organizationsState.next({
      ...this.organizationsState.getValue(),
      activeOrganizationId
    });
  }
}
