// import { sorts as appSorts } from "../../src/app/issues/issues-page/issues-page.component";

export const organization = {
  name: "cypresstestorg",
  otherOrg: "cypress-test-org-other",
};

export const team = {
  name: "cypresstestteam",
};

export const newTeam = {
  slug: "newcypresstestteam",
};

export const project = {
  name: "cypresstestproject",
};

export const newProject = {
  name: "newcypresstestproject",
  platform: "newcypresstestplatform",
};

type Environment = "production" | "staging" | "development";

export const environments: { [key in Environment]: Environment } = {
  production: "production",
  staging: "staging",
  development: "development",
};

// export const sorts = appSorts;
