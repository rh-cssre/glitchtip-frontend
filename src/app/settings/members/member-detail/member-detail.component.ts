import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { MemberDetailService } from "src/app/api/organizations/member-detail.service";

@Component({
  selector: "gt-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  memberDetail$ = this.memberDetailService.memberDetail$;
  teams$ = this.organizationsService.organizationTeams$;
  updateMemberError$ = this.memberDetailService.updateMemberError$;
  updateMemberLoading$ = this.memberDetailService.updateMemberLoading$;
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));
  memberIdSlug$ = this.route.paramMap.pipe(
    map((params) => params.get("member-id"))
  );
  routeParams$ = combineLatest([this.orgSlug$, this.memberIdSlug$]);
  form = new UntypedFormGroup({
    role: new UntypedFormControl(""),
  });

  constructor(
    public route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private memberDetailService: MemberDetailService
  ) {}

  ngOnInit(): void {
    this.routeParams$
      .pipe(
        map(([organizationSlug, memberIdSlug]) => {
          if (organizationSlug && memberIdSlug) {
            this.memberDetailService
              .retrieveMemberDetail(organizationSlug, memberIdSlug)
              .toPromise();
            this.organizationsService.retrieveOrganizationTeams(
              organizationSlug
            );
          }
        })
      )
      .subscribe();

    this.memberDetail$.subscribe((data) => {
      if (data) {
        this.form.patchValue({
          role: data.role,
        });
      }
    });
  }

  ngOnDestroy() {
    this.memberDetailService.clearState();
  }

  onSubmit() {
    const role = this.form.get("role")?.value;
    this.memberDetailService.updateMember(role);
    // entire member object needs to be put to orgs/org-slug/members/member-id
  }
}
