export interface NewProjectAlert {
  timespan_minutes: number;
  quantity: number;
  alertRecipients: AlertRecipient[];
}

export interface ProjectAlert extends NewProjectAlert {
  pk: number;
}

export interface AlertRecipient {
  pk?: number;
  recipientType: AlertRecipientType;
  url: string;
}

type AlertRecipientType = "email" | "webhook";
