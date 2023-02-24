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
import { MemberDetailService } from "src/app/api/organizations/member-detail.service";

@Component({
  selector: "gt-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  member$ = this.memberDetailService.member$;
  memberTeams$ = this.memberDetailService.memberTeams$;
  updateMemberError$ = this.memberDetailService.updateMemberRoleError$;
  updateMemberLoading$ = this.memberDetailService.updateMemberRoleLoading$;
  transferOrgOwnershipError$ =
    this.memberDetailService.transferOrgOwnershipError$;
  transferOrgOwnershipLoading$ =
    this.memberDetailService.transferOrgOwnershipLoading$;
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));
  memberIdParam$ = this.route.paramMap.pipe(
    map((params) => params.get("member-id"))
  );
  routeParams$ = combineLatest([this.orgSlug$, this.memberIdParam$]);
  form = new UntypedFormGroup({
    role: new UntypedFormControl(""),
  });

  constructor(
    public route: ActivatedRoute,
    private memberDetailService: MemberDetailService
  ) {}

  ngOnInit(): void {
    this.routeParams$
      .pipe(
        map(([organizationSlug, memberIdParam]) => {
          if (organizationSlug && memberIdParam) {
            this.memberDetailService.retrieveMemberDetail(
              organizationSlug,
              +memberIdParam
            );
          }
        })
      )
      .subscribe();

    this.member$.subscribe((data) => {
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
    this.memberDetailService.updateMemberRole(role);
  }

  transferOrgOwnership() {
    this.memberDetailService.transferOrgOwnership();
  }
}
