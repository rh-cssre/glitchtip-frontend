import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { filter, map, withLatestFrom, startWith } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { MemberDetailService } from "src/app/api/organizations/member-detail.service";
import { MemberRole } from "src/app/api/organizations/organizations.interface";

@Component({
  selector: "gt-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  member$ = this.memberDetailService.member$;
  memberTeams$ = this.memberDetailService.memberTeams$;
  availableRoles$ = this.memberDetailService.availableRoles$;
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
  form = new FormGroup({
    role: new FormControl<MemberRole | null>(null),
  });
  formRole = this.form.get("role") as FormControl<MemberRole | null>;

  selectedRoleScopes$ = this.formRole.valueChanges.pipe(
    startWith(null),
    withLatestFrom(this.availableRoles$),
    filter(([_, availableRoles]) => !!availableRoles),
    map(([_, availableRoles]) => {
      return availableRoles!
        .find((roleDetails) => roleDetails.id === this.formRole.value)
        ?.scopes.join(", ");
    })
  );

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
      if (data && this.form.pristine) {
        this.form.patchValue({
          role: data.role,
        });
        this.form.markAsPristine();
      }
    });
  }

  ngOnDestroy() {
    this.memberDetailService.clearState();
  }

  onSubmit() {
    const role = this.formRole.value;
    if (role) {
      this.memberDetailService.updateMemberRole(role);
    }
  }

  transferOrgOwnership() {
    this.memberDetailService.transferOrgOwnership();
  }
}
