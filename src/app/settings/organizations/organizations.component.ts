import { Component, OnInit } from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Organization } from "src/app/api/organizations/organizations.interface";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-organizations",
  templateUrl: "./organizations.component.html",
  styleUrls: ["./organizations.component.scss"]
})
export class OrganizationsComponent implements OnInit {
  organizations$: Observable<
    Organization[]
  > = this.organizationsService.organizations$.pipe(
    catchError(error => {
      "uh oh";
      return of(null);
    })
  );

  constructor(
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Read the parameter from the route - supports deep linking
    this.route.paramMap.subscribe(params => {
      const slug = params.get("slug");
      this.organizationsService.changeSelectedOrganization(slug);
    });
  }

  onSelected(orgSlug: string) {
    this.router.navigate(["./settings", orgSlug]);
  }

  removeOrganization(slug: string) {
    this.organizationsService.deleteOrganization(slug);
  }
}
