import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  effect,
  computed,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { MatRadioModule } from "@angular/material/radio";
import { MatDialog } from "@angular/material/dialog";
import { OrganizationsService } from "src/app/api/organizations.service";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { ListRowLinkComponent } from "src/app/shared/list/list-row-link.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { MemberDetailService } from "src/app/settings/members/member-detail/member-detail.service";
import { MemberRole } from "src/app/api/organizations/organizations.interface";
import { MEMBER_ROLES, roleDescription, roleName } from "../member-roles";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";

@Component({
  templateUrl: "./member-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    FormErrorComponent,
    MatRadioModule,
    TopAppBar,
    BackLinkComponent,
    LoadingButtonComponent,
    ListComponent,
    ListRowComponent,
    ListRowLinkComponent,
    PageHeaderComponent,
    SettingsSectionComponent,
  ],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  private memberDetailService = inject(MemberDetailService);
  private organizationsService = inject(OrganizationsService);
  private dialog = inject(MatDialog);

  member = this.memberDetailService.member;
  memberTeams = this.memberDetailService.memberTeams;
  updateMemberError = this.memberDetailService.updateMemberRoleError;
  updateMemberLoading = this.memberDetailService.updateMemberRoleLoading;
  transferOrgOwnershipError =
    this.memberDetailService.transferOrgOwnershipError;
  transferOrgOwnershipLoading =
    this.memberDetailService.transferOrgOwnershipLoading;
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));
  memberIdParam$ = this.route.paramMap.pipe(
    map((params) => params.get("member-id")),
  );
  routeParams$ = combineLatest([this.orgSlug$, this.memberIdParam$]);
  form = new FormGroup({
    role: new FormControl<MemberRole | null>(null),
  });
  formRole = this.form.get("role") as FormControl<MemberRole | null>;

  readonly roles = MEMBER_ROLES;
  readonly invitePendingText = $localize`Invite pending`;

  /** Changing roles needs member:write (managers and owners). */
  canEditRole = this.organizationsService.canWriteMember;
  /**
   * The backend allows a transfer only for owners (member:admin plus being the
   * account owner or having the owner role), so org:admin is the signal.
   */
  canTransfer = computed(() => {
    const member = this.member();
    return (
      this.organizationsService.canAdminOrg() &&
      !!member &&
      !member.isOwner &&
      !member.pending
    );
  });

  roleName = roleName;
  roleDescription = roleDescription;

  constructor() {
    effect(() => {
      const member = this.member();
      if (member && this.form.pristine) {
        this.form.patchValue({
          role: member.role,
        });
        this.form.markAsPristine();
      }
    });
  }

  ngOnInit(): void {
    this.routeParams$
      .pipe(
        map(([organizationSlug, memberIdParam]) => {
          if (organizationSlug && memberIdParam) {
            this.memberDetailService.retrieveMemberDetail(
              organizationSlug,
              +memberIdParam,
            );
          }
        }),
      )
      .subscribe();
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

  transferOrgOwnership(email: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Transfer ownership to ${email}:email:?`,
          message: $localize`They will hold the organization's subscription. Nobody's role changes.`,
          confirmText: $localize`Transfer`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.memberDetailService.transferOrgOwnership();
      });
  }
}
