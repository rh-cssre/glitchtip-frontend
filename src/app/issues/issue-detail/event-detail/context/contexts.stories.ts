import { of } from "rxjs";

import { ContextsComponent } from "./contexts.component";
import { generateIconPath, iconDictionary } from "src/app/shared/shared.utils";

export default {
  title: "Events/Contexts",
  component: ContextsComponent,
};

export const Contexts = () => {
  const fullContext = [
    {
      title: "em@jay.com",
      subtitle: "EmJay117",
      key: "Username",
      type: "user",
      icon: null,
      matIcon: "account_circle",
    },
    {
      title: "FireFox",
      subtitle: "11.7",
      key: "Version",
      type: "browser",
      icon: "static/assets/images/browser-svgs/firefox/firefox.svg",
      matIcon: null,
    },
    {
      title: "CPython",
      subtitle: "3.8.0",
      key: "Version",
      type: "runtime",
      icon: "static/assets/images/logos/48x48/python.svg",
      matIcon: null,
    },
    {
      title: "Ubuntu",
      subtitle: "20.0.4",
      key: "Version",
      type: "os",
      icon: "static/assets/images/os-logos/ubuntu.png",
      matIcon: null,
    },
    {
      title: "Red Ryder",
      subtitle: "amd64",
      key: "Arch",
      type: "device",
      icon: null,
      matIcon: "devices_other",
    },
    {
      title: "Graphic",
      subtitle: "a vendor",
      key: "Vendor",
      type: "gpu",
      icon: null,
      matIcon: null,
    },
  ];

  return {
    props: {
      specialContexts$: of(fullContext),
    },
  };
};

Contexts.story = {
  name: "Event Detail Full Context",
};

export const UnknownContexts = () => {
  const transformedContexts: any = [
    {
      type: "user",
      icon: null,
      matIcon: "account_circle",
      title: "em@jay.com",
      subtitle: "117",
      key: "ID",
    },
    {
      type: "runtime",
      icon: "static/assets/images/logos/48x48/python.svg",
      matIcon: "tab",
      title: "CPython",
      subtitle: "3.8.6",
      key: "Version",
    },
    {
      type: "browser",
      icon: undefined,
      matIcon: "tab",
      title: "Unknown Browser",
      subtitle: "Unknown",
      key: "Version",
    },
    {
      type: "device",
      icon: null,
      matIcon: "devices_other",
      title: "Unknown Device",
      subtitle: null,
      key: null,
    },
    {
      type: "os",
      icon: undefined,
      matIcon: "computer",
      title: "Unknown Operating System",
      subtitle: "Unknown",
      key: "Version",
    },
  ];
  return {
    props: {
      specialContexts$: of(transformedContexts),
    },
  };
};

UnknownContexts.story = {
  name: "Event Detail Contexts - Unknown Scenario",
};

export const IconPaths = () => {
  const iconMarkup = Object.keys(iconDictionary).map(
    (icon) => `
    <div style="border: 1px solid lightgray; margin: 5px; padding: 0 10px 10px;">
      <p style="font-size: 0.75em">${icon}</p>
      <img
        style="width: 50px; height: 50px;"
        class="image"
        src="${generateIconPath(icon)}"
      />
    </div>
  `
  );

  return {
    template: `
      <div style="display: flex; flex-wrap: wrap;">
        ${iconMarkup.join("")}
      </div>
    `,
  };
};

IconPaths.story = {
  name: "Icon Paths",
};
