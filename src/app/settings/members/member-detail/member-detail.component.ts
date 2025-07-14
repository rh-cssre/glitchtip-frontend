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
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MemberDetailService } from "src/app/settings/members/member-detail/member-detail.service";
import { MemberRole } from "src/app/api/organizations/organizations.interface";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";

@Component({
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    LoadingButtonComponent,
    MatListModule,
    DetailHeaderComponent,
  ],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  private memberDetailService = inject(MemberDetailService);

  member = this.memberDetailService.member;
  memberTeams = this.memberDetailService.memberTeams;
  availableRoles = this.memberDetailService.availableRoles;
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

  selectedRoleScopes = computed(() => {
    const availableRoles = this.availableRoles();
    if (availableRoles) {
      return availableRoles
        .find((roleDetails) => roleDetails.id === this.formRole.value)
        ?.scopes.join(", ");
    }
    return;
  });

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

  transferOrgOwnership() {
    this.memberDetailService.transferOrgOwnership();
  }
}
