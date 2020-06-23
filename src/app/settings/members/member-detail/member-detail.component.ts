import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailComponent implements OnInit {
  memberDetail$ = this.organizationsService.memberDetail$;
  orgSlug: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => {
          const organizationSlug: string | undefined = params["org-slug"];
          const memberIdSlug: string | undefined = params["member-id"];
          this.orgSlug = organizationSlug;
          return { organizationSlug, memberIdSlug };
        })
      )
      .subscribe(({ organizationSlug, memberIdSlug }) => {
        if (organizationSlug && memberIdSlug) {
          this.organizationsService
            .retrieveMemberDetail(organizationSlug, memberIdSlug)
            .toPromise();
        }
      });
  }
}
