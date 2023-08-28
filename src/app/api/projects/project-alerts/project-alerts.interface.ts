export interface NewProjectAlert {
  timespan_minutes: number | null;
  quantity: number | null;
  uptime: boolean;
  alertRecipients: NewAlertRecipient[];
}

export interface ParticalProjectAlert extends NewProjectAlert {
  pk: number;
  alertRecipients: AlertRecipient[];
}
export interface ProjectAlert extends ParticalProjectAlert {
  name: string;
}

export interface NewAlertRecipient {
  recipientType: RecipientType;
  url: string;
}

export interface AlertRecipient extends NewAlertRecipient {
  pk: number;
}

export type RecipientType = "email" | "webhook" | "discord";
