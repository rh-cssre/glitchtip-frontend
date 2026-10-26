// import { sorts as appSorts } from "../../src/app/issues/issues-page/issues-page.component";

export const seededOrg = {
  name: "e2etestobj-seeded-org",
  slug: "e2etestobj-seeded-org",
};

export const seededTeam = {
  name: "seeded-team",
};

export const secondSeededTeam = {
  slug: "second-seeded-team",
};

export const seededProject1 = {
  name: "seeded-project",
  slug: "seeded-project",
};

export const seededProject2 = {
  name: "second-seeded-project",
  slug: "second-seeded-project",
};

export const seededProject3 = {
  name: "third-seeded-project",
  slug: "third-seeded-project",
};

export const seededMonitorName = "seeded-monitor"

export const newProject = {
  name: "other-project",
  platform: "newcypresstestplatform",
};

type Environment = "production" | "staging" | "development";

export const environments: { [key in Environment]: Environment } = {
  production: "production",
  staging: "staging",
  development: "development",
};

// export const sorts = appSorts;
