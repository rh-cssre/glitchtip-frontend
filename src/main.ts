import { enableProdMode } from "@angular/core";
import { loadTranslations } from "@angular/localize";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

// First locale is default, add additional after it
const availableLocales = ["en", "fr", "nb"];
// Direct macrolanguages to specific ones. Example: Norwegian becomes Bokmål
const localeMappings: { [key: string]: string } = { no: "nb" };

let locale =
  availableLocales.find((l) => navigator.language.startsWith(l)) ??
  availableLocales[0];
window.document.documentElement.lang = locale;

if (locale in localeMappings) {
  locale = localeMappings[locale];
}

if (locale === availableLocales[0]) {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
} else {
  // fetch resources for runtime translations. this could also point to an API endpoint
  fetch(`static/assets/i18n/messages.${locale}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return response.json();
    })
    .then((result) => {
      loadTranslations(result);

      platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch((err) => console.error(err));
    });
}
