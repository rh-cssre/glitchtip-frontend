import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ActivatedRoute } from "@angular/router";
import { map, filter } from "rxjs/operators";

@Component({
  selector: "app-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersComponent implements OnInit {
  organizationMembers$ = this.organizationsService.organizationMembers$;
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;

  constructor(
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => params["org-slug"] as string),
        filter((slug) => !!slug)
      )
      .subscribe((slug) => {
        this.organizationsService.retrieveOrganizationMembers(slug).toPromise();
      });
  }
}
