import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map, filter } from "rxjs/operators";
import { OrganizationDetailService } from "src/app/api/organizations/organization-detail.service";
import { MembersService } from "src/app/api/organizations/members.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatChipsModule } from "@angular/material/chips";
import { AsyncPipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { OrganizationsService } from "src/app/api/organizations.service";
import { components } from "src/app/api/api-schema";

type Member = components["schemas"]["OrganizationUserSchema"];

@Component({
  selector: "gt-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    LoadingButtonComponent,
    MatTooltipModule,
    AsyncPipe,
  ],
})
export class MembersComponent implements OnInit {
  private organizationsService = inject(OrganizationsService);
  private organizationDetailService = inject(OrganizationDetailService);
  private membersService = inject(MembersService);
  private route = inject(ActivatedRoute);

  activeOrganizationDetail = this.organizationsService.activeOrganization;
  members$ = this.membersService.members$;

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => params["org-slug"] as string),
        filter((slug) => !!slug)
      )
      .subscribe((slug) => {
        this.organizationDetailService.retrieveOrganizationMembers(slug);
      });
  }

  resendInvite(member: Member) {
    this.membersService.resendInvite(member);
  }

  removeMember(member: any) {
    const message = member.isMe
      ? `Are you sure you'd like to leave this organization?`
      : `Are you sure you want to remove ${member.email} from this organization?`;
    if (window.confirm(message)) {
      this.membersService.removeMember(member as any, member.isMe);
    }
  }
}
