import { createAction, props } from "@ngrx/store";
import { Organization, OrganizationDetail } from "./organizations.interface";

export const setOrganizations = createAction(
  "[Organizations] set Organizations",
  props<{ organizations: Organization[] }>()
);

export const setActiveOrganizationId = createAction(
  "[Organizations] set active organization id",
  props<{ id: number }>()
);

export const setActiveOrganization = createAction(
  "[Organizations] set active organization",
  props<{ organization: OrganizationDetail }>()
);
