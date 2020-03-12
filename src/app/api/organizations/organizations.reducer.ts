import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, Action, on } from "@ngrx/store";
import { Organization, OrganizationDetail } from "./organizations.interface";
import * as OrganizationActions from "./organizations.actions";

export interface State extends EntityState<Organization> {
  activeOrganizationId: number | null;
  activeOrganization: OrganizationDetail | null;
}

export const adapter: EntityAdapter<Organization> = createEntityAdapter<
  Organization
>({});

export const initialState: State = adapter.getInitialState({
  activeOrganizationId: null,
  activeOrganization: null
});

const organizationReducer = createReducer(
  initialState,
  on(OrganizationActions.setOrganizations, (state, { organizations }) =>
    adapter.setAll(organizations, state)
  ),
  on(OrganizationActions.setActiveOrganizationId, (state, { id }) => ({
    ...state,
    activeOrganizationId: id
  })),
  on(OrganizationActions.setActiveOrganization, (state, { organization }) => ({
    ...state,
    activeOrganization: organization
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return organizationReducer(state, action);
}

const { selectAll } = adapter.getSelectors();

export const selectAllOrganizations = selectAll;
