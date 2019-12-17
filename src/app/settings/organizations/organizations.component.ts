import { Component } from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { Router } from "@angular/router";
import { Organization } from "src/app/api/organizations/organizations.interface";
import { Observable, of, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-organizations",
  templateUrl: "./organizations.component.html",
  styleUrls: ["./organizations.component.scss"]
})
export class OrganizationsComponent {
  error$ = new Subject<string>();

  organizations$: Observable<
    Organization[]
  > = this.organizationsService.organizations$.pipe(
    catchError(error => {
      this.error$.next(error);
      return of(null);
    })
  );

  constructor(
    private organizationsService: OrganizationsService,
    private router: Router
  ) {}

  onSelected(orgSlug: string) {
    this.organizationsService.changeSelectedOrganization(orgSlug);
    this.router.navigate(["./settings", orgSlug]);
  }

  removeOrganization(slug: string) {
    this.organizationsService.deleteOrganization(slug);
  }
}
