import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/app/shared/shared.module";
import { NotificationsDraftComponent } from "./notifications-draft/notifications-draft.component";
import { NewAlertRecipientComponent } from "./new-alert-recipient/new-alert-recipient.component";

export default {
  title: "Drafts/Notifications",
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
    }),
    withKnobs,
  ],
};

export const notifications = () => {
  return {
    component: NotificationsDraftComponent,
  };
};

notifications.story = {
  name: "Notifications",
};

export const addAlertRecipientDialog = () => {
  return {
    component: NewAlertRecipientComponent,
  };
};

addAlertRecipientDialog.story = {
  name: "Add Alert Recipient",
};
