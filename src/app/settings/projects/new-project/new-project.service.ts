import { computed, inject, Injectable } from "@angular/core";
import { client } from "src/app/shared/api/api";
import { components } from "src/app/api/api-schema";
import { OrganizationsService } from "src/app/api/organizations.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

type ProjectNew = components["schemas"]["ProjectIn"];

interface State {
  loading: boolean;
  error: string;
}

const initialState: State = {
  loading: false,
  error: "",
};

@Injectable()
export class NewProjectService extends StatefulService<State> {
  private orgService = inject(OrganizationsService);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  constructor() {
    super(initialState);
  }

  async createProject(project: ProjectNew, teamSlug: string, orgSlug: string) {
    const { data, error } = await client.POST(
      "/api/0/teams/{organization_slug}/{team_slug}/projects/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
            team_slug: teamSlug,
          },
        },
        body: project,
      },
    );
    if (data) {
      this.clearState();
      this.orgService.refreshActiveOrganization();
    }
    if (error) {
      this.setState({ loading: false, error: `${(error as any).status}` });
    }
    return data;
  }
}
