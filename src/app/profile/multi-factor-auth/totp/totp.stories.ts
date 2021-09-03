import { HttpClientTestingModule } from "@angular/common/http/testing";
import { moduleMetadata } from "@storybook/angular";
import { Meta } from "@storybook/angular/types-6-0";
import { of } from "rxjs";
import { SharedModule } from "src/app/shared/shared.module";
import { totpUserKey } from "./test-data";
import { TOTPComponent } from "./totp.component";

export default {
  title: "profile/TOTP",
  component: TOTPComponent,
  decorators: [
    moduleMetadata({ imports: [HttpClientTestingModule, SharedModule] }),
  ],
} as Meta;

export const Disabled = () => ({
  props: {
    TOTPKey$: of(null),
  },
});

export const QRCode = () => ({
  props: {
    TOTPKey$: of(null),
    step$: of(3),
    TOTP$: of({
      provisioning_uri: "https://www.example.com",
      secret_key: "AAAAAAAAAA",
    }),
  },
});

export const Enabled = () => ({
  props: {
    TOTPKey$: of(totpUserKey),
  },
});
