import { Meta } from "@storybook/angular";
import { of } from "rxjs";
import { totpUserKey } from "./test-data";
import { TOTPComponent } from "./totp.component";

export default {
  title: "profile/TOTP",
  component: TOTPComponent,
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
