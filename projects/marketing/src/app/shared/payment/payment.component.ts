import { Component, ViewChild, AfterViewChecked, input, inject } from "@angular/core";
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { LinksService } from "../../links.service";
import { environment } from "src/environments/environment";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { QuestionAndAnswerComponent } from "./question-and-answer/question-and-answer.component";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { DecimalPipe } from "@angular/common";
/**
 * Copied HTML from the frontend version of this, pulled some data that is
 * currently in use and hardcoded here, and sharing the SCSS file
 */
@Component({
  selector: "mkt-payment",
  templateUrl: "./payment.component.html",
  imports: [
    DecimalPipe,
    MatTabsModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatIcon,
    RouterLink,
    QuestionAndAnswerComponent,
  ],
  styleUrls: [
    "/src/app/settings/subscription/payment/payment.component.scss",
    "./payment.component.scss",
  ],
})
export class PaymentComponent implements AfterViewChecked {
  private links = inject(LinksService);

  @ViewChild("tabs", { static: false }) tabs?: MatTabGroup;
  readonly pricingPage = input<boolean>(false);
  billingEmail = environment.billingEmail;
  registerLink = this.links.registerLink;
  selectedTab = 0;

  /**
   * Pulled from frontend's payment component's planOptions$, pruned to use
   * only what's needed
   */
  planOptions = [
    {
      name: "Free",
      description: "Up to 1000 events per month",
      plans: [{ amount: 0 }],
    },
    {
      name: "Small",
      description: "Up to 100k events per month",
      plans: [{ amount: 15 }],
    },
    {
      name: "Medium",
      description: "Up to 500k events per month",
      plans: [{ amount: 50 }],
    },
    {
      name: "Large",
      description: "Up to 3 million events per month",
      plans: [{ amount: 250 }],
    },
  ];

  setSelectedTab(value: number) {
    this.selectedTab = value;
  }

  ngAfterViewChecked() {
    this.tabs?.realignInkBar();
  }
}
