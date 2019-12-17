import { Component, ChangeDetectionStrategy } from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { Observable, of, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { Organization } from "src/app/api/organizations/organizations.interface";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavComponent {
  error$ = new Subject<string>();

  selectedOrganization$: Observable<
    Organization
  > = this.organizationsService.selectedOrganization$.pipe(
    catchError(error => {
      this.error$.next(error);
      return of(null);
    })
  );

  organizations$: Observable<
    Organization[]
  > = this.organizationsService.organizations$.pipe(
    catchError(error => {
      this.error$.next(error);
      return of(null);
    })
  );

  constructor(private organizationsService: OrganizationsService) {}

  setOrganization(orgSlug: string) {
    this.organizationsService.changeSelectedOrganization(orgSlug);
  }
}
