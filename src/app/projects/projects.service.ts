import { Injectable, computed } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { StatefulService } from "../shared/stateful-service/signal-state.service";
import { client } from "../api/api";
import { components } from "../api/api-schema";

type ProjectOrgaizationSchema =
  components["schemas"]["ProjectOrganizationSchema"];

interface ProjectsState {
  projects: ProjectOrgaizationSchema[] | null;
  initialLoadComplete: boolean;
  loading: boolean;
}

const initialState: ProjectsState = {
  projects: null,
  initialLoadComplete: false,
  loading: false,
};

@Injectable({
  providedIn: "root",
})
export class ProjectsService extends StatefulService<ProjectsState> {
  projects = computed(() => this.state().projects);
  projects$ = toObservable(this.projects);
  initialLoadComplete = computed(() => this.state().initialLoadComplete);
  initialLoadComplete$ = toObservable(this.initialLoadComplete);
  loading = computed(() => this.state().loading);
  loading$ = toObservable(this.loading);

  constructor() {
    super(initialState);
  }

  async retrieveProjects() {
    this.setState({ loading: true });
    const { data } = await client.GET("/api/0/projects/");
    if (data) {
      this.setProjects(data);
    }
  }

  private setProjects(projects: ProjectOrgaizationSchema[]) {
    this.setState({ projects, initialLoadComplete: true, loading: false });
  }
}
