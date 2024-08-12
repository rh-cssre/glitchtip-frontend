import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map, filter } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { MembersService } from "src/app/api/organizations/members.service";
import { Member, MemberSelector } from "src/app/api/organizations/organizations.interface";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatChipsModule } from "@angular/material/chips";
import { NgFor, NgIf, AsyncPipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "gt-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatCardModule,
    MatDividerModule,
    NgFor,
    NgIf,
    MatChipsModule,
    LoadingButtonComponent,
    MatTooltipModule,
    AsyncPipe,
  ],
})
export class MembersComponent implements OnInit {
  activeOrganizationDetail$ =
    this.organizationsService.activeOrganizationDetail$;
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

  resendInvite(member: Member) {
    this.membersService.resendInvite(member);
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
