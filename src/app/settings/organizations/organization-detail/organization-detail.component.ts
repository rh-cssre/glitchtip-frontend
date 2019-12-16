import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { OrganizationsService } from "../../../api/organizations/organizations.service";
import { of } from "rxjs";

@Component({
  selector: "app-organization-detail",
  templateUrl: "./organization-detail.component.html",
  styleUrls: ["./organization-detail.component.scss"]
})
export class OrganizationDetailComponent implements OnInit {
  selectedOrganization$ = this.organizationsService.getOrganizations;
  slug: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizationsService: OrganizationsService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => of(params.get("slug"))))
      .subscribe(slug => (this.slug = slug));

    this.organizationsService.retrieveOrganizationDetail(this.slug);
  }

  removeOrganization() {
    // this.organizationsService.deleteOrganization(this.organization.slug);
    // show first org in list or if none, empty screen
  }
}
