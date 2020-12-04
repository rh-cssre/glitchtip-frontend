import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, select } from "@storybook/addon-knobs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";

import { SharedModule } from "../../../../shared/shared.module";
import { ContextsComponent } from "./contexts.component";
import { generateIconPath } from "src/app/shared/shared.utils";

export default {
  title: "Events/Contexts",
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [],
    }),
    withKnobs,
  ],
};

export const contexts = () => {
  const options = [];
  let user = boolean("User", true);
  user
    ? options.push({
        title: "em@jay.com",
        subtitle: "EmJay117",
        key: "Username",
        type: "user",
        icon: "account_circle",
      })
    : null;

  let browser = boolean("Browser", true);
  browser
    ? options.push({
        title: "FireFox",
        subtitle: "11.7",
        key: "Version",
        type: "browser",
        icon: "assets/images/browser-svgs/firefox/firefox.svg",
      })
    : null;

  let runtime = boolean("Runtime", true);
  runtime
    ? options.push({
        title: "CPython",
        subtitle: "3.8.0",
        key: "Version",
        type: "runtime",
        icon: "assets/images/logos/48x48/cpython.png",
      })
    : null;

  let os = boolean("OS", true);
  os
    ? options.push({
        title: "Ubuntu",
        subtitle: "20.0.4",
        key: "Version",
        type: "os",
        icon: "assets/images/os-logos/ubuntu.png",
      })
    : null;

  let device = boolean("Device", true);
  device
    ? options.push({
        title: "Red Ryder",
        subtitle: "amd64",
        key: "Arch",
        type: "device",
        icon: null,
      })
    : null;

  let gpu = boolean("GPU", true);
  gpu
    ? options.push({
        title: "Graphic",
        subtitle: "a vendor",
        key: "Vendor",
        type: "gpu",
        icon: null,
      })
    : null;

  return {
    component: ContextsComponent,
    props: {
      specialContexts$: of(options),
    },
  };
};

contexts.story = {
  name: "Event Detail Contexts",
};

const options = [
  "chrome",
  "firefox",
  "opera",
  "safari",
  "mobilesafari",
  "edge",
  "chromium",
  "chromemobile",
  "chromemobileios",
  "qqbrowser",
  "playstation",
  "internetexplorer",
];
const defaultValue = "chrome";

export const IconPaths = () => {
  const value = select("Path", options, defaultValue);
  const path = generateIconPath(value);
  const template = () => `
    <div>
      <p>path: ${path}</p>
      <img class="image" src="${path}" />
    </div>
  `;

  return {
    template: template(),
  };
};

IconPaths.story = {
  name: "Icon Paths",
};
