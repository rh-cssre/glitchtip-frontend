export interface NewProjectAlert {
  timespanMinutes: number | null;
  quantity: number | null;
  uptime: boolean;
  alertRecipients: NewAlertRecipient[];
}

export interface PartialProjectAlert extends NewProjectAlert {
  id: number;
  alertRecipients: AlertRecipient[];
}
export interface ProjectAlert extends PartialProjectAlert {
  name: string;
}

export interface NewAlertRecipient {
  recipientType: RecipientType;
  url: string;
}

export interface AlertRecipient extends NewAlertRecipient {
  id: number;
}

export type RecipientType = "email" | "webhook" | "discord" | "googlechat";
