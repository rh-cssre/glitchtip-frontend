import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, filter } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { MembersService } from "src/app/api/organizations/members.service";
import { MemberSelector } from "src/app/api/organizations/organizations.interface";

@Component({
  selector: "gt-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersComponent implements OnInit {
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  members$ = this.membersService.members$;

  constructor(
    private organizationsService: OrganizationsService,
    private membersService: MembersService,
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

  resendInvite(memberId: number) {
    this.membersService.resendInvite(memberId);
  }

  removeMember(member: MemberSelector) {
    const message = member.isMe
      ? `Are you sure you'd like to leave this organization?`
      : `Are you sure you want to remove ${member.email} from this organization?`;
    if (window.confirm(message)) {
      this.membersService.removeMember(member);
    }
  }
}
