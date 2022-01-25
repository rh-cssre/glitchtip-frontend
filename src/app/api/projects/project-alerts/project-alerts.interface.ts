export interface NewProjectAlert {
  timespan_minutes: number | null;
  quantity: number | null;
  uptime: boolean;
  alertRecipients: NewAlertRecipient[];
}

export interface ProjectAlert extends NewProjectAlert {
  pk: number;
  alertRecipients: AlertRecipient[];
}

export interface NewAlertRecipient {
  recipientType: RecipientType;
  url: string;
}

export interface AlertRecipient extends NewAlertRecipient {
  pk: number;
}

export type RecipientType = "email" | "webhook";
