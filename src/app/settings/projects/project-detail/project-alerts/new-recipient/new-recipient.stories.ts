import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { MatDialogRef } from "@angular/material/dialog";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MicroSentryModule } from "@micro-sentry/angular";

import { NewRecipientComponent } from "./new-recipient.component";

const meta: Meta<NewRecipientComponent> = {
  component: NewRecipientComponent,
  decorators: [
    applicationConfig({
      providers: [
        { provide: MatDialogRef, useValue: {} },
        provideRouter([]),
        provideHttpClient(),
        importProvidersFrom(MatSnackBarModule, MicroSentryModule.forRoot({})),
      ],
    }),
  ],
  render: (args: NewRecipientComponent) => ({
    props: {
      ...args,
    },
  }),
};

export default meta;
type Story = StoryObj<NewRecipientComponent>;

export const Default: Story = {
  args: {},
};
