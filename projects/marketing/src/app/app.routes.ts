import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./home.component").then((m) => m.HomeComponent),
    title: "Open Source Error Tracking",
  },
  {
    path: "pricing",
    loadComponent: () =>
      import("./pricing/pricing.component").then((m) => m.PricingComponent),
    title: "Pricing",
  },
  {
    path: "hipaa",
    loadComponent: () =>
      import("./hipaa/hipaa.component").then((m) => m.HipaaComponent),
    title: "HIPAA Compliance",
  },
  {
    path: "legal/:slug",
    loadComponent: () =>
      import("./legal/legal.component").then((m) => m.LegalComponent),
  },
  {
    path: "blog",
    loadChildren: () => import("./blog/routes"),
    title: "Blog",
  },
  {
    path: "documentation",
    loadChildren: () => import("./documentation/routes"),
    title: "Documentation",
  },
  {
    path: "sdkdocs",
    loadChildren: () => import("./sdkdocs/routes"),
    title: "Sentry SDK Documentation",
  },
];
