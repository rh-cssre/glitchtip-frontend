// import { sorts as appSorts } from "../../src/app/issues/issues-page/issues-page.component";

export const organization = {
  name: "Business Company, Inc.",
  slug: "business-company-inc",
  otherOrg: "cypress-test-org-other",
};

export const team = {
  name: "cypresstestteam",
};

export const newTeam = {
  slug: "newcypresstestteam",
};

export const project = {
  name: "NicheScrip",
  slug: "nichescrip",
};

export const project2 = {
  name: "SwitchGrip",
  slug: "switchgrip",
};

export const project3 = {
  name: "PitchFlip",
  slug: "pitchflip",
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
