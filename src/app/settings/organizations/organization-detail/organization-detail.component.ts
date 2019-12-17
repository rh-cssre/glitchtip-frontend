import { Component } from "@angular/core";
import { combineLatest, of, Subject, Observable } from "rxjs";
import { catchError, map, filter } from "rxjs/operators";
import { Organization } from "src/app/api/organizations/organizations.interface";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "app-organization-detail",
  templateUrl: "./organization-detail.component.html",
  styleUrls: ["./organization-detail.component.scss"]
})
export class OrganizationDetailComponent {
  error$ = new Subject<string>();

  organization$: Observable<
    Organization
  > = this.organizationService.selectedOrganization$.pipe(
    catchError(error => {
      this.error$.next(error);
      return of(null);
    })
  );

  constructor(private organizationService: OrganizationsService) {}

  removeOrganization() {
    // this.organizationsService.deleteOrganization(this.organization.slug);
    // show first org in list or if none, empty screen
  }
}
