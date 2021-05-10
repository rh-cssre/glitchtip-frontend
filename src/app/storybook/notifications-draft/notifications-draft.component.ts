import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

interface Alerts {
  pk: number;
  timespan_minutes: number;
  quantity: number;
  alertRecipients: Recipients[];
}

interface Recipients {
  pk: number;
  recipientType: "email" | "webhook";
  url: string;
}

const testData: Alerts[] = [
  {
    pk: 49,
    timespan_minutes: 30,
    quantity: 1000,
    alertRecipients: [
      {
        pk: 4,
        recipientType: "webhook",
        url: "http://www.sendithere.com",
      },
    ],
  },
  {
    pk: 48,
    timespan_minutes: 3,
    quantity: 8,
    alertRecipients: [
      // {
      //   pk: 3,
      //   recipientType: "email",
      //   url: "http://email@email.email",
      // },
      {
        pk: 2,
        recipientType: "webhook",
        url: "http://www.slackalert.com",
      },
      {
        pk: 1,
        recipientType: "webhook",
        url: "http://www.webhook.com",
      },
    ],
  },
];

@Component({
  selector: "app-notifications-draft",
  templateUrl: "./notifications-draft.component.html",
  styleUrls: ["./notifications-draft.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsDraftComponent implements OnInit {
  alerts: Alerts[] = testData;
  emailTeam: boolean = true;
  createNew: boolean = true;
  addWebhook: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
