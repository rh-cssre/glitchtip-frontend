import { Component, OnInit, inject, input } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { TransactionGroupDetailService } from "./transaction-group-detail-state";
import { HumanizeDurationPipe } from "../../shared/seconds-or-ms.pipe";
import { OrganizationsService } from "src/app/api/organizations.service";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";

@Component({
  selector: "gt-transaction-group-detail",
  templateUrl: "./transaction-group-detail.html",
  styleUrls: ["./transaction-group-detail.scss"],
  imports: [
    MatCardModule,
    RouterLink,
    MatIconModule,
    TopAppBar,
    BackLinkComponent,
    HumanizeDurationPipe,
    DetailHeaderComponent,
  ],
  providers: [TransactionGroupDetailService],
})
export class TransactionGroupDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private organizationsService = inject(OrganizationsService);
  private transactionGroupDetailService = inject(TransactionGroupDetailService);

  orgSlug = input.required<string>({ alias: "org-slug" });
  id = input.required<number>({ alias: "transaction-group-id" });
  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
  organization = this.organizationsService.activeOrganization;
  initialLoadComplete = this.transactionGroupDetailService.initialLoadComplete;
  transactionGroup = this.transactionGroupDetailService.transactionGroup;

  ngOnInit() {
    this.transactionGroupDetailService.setParams(this.orgSlug(), this.id());
  }

  generateBackLink(projectId: string) {
    return {
      ...this.route.snapshot.queryParams,
      project: projectId,
    };
  }
}
