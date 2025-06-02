import { Injectable, computed, inject } from "@angular/core";
import { tap } from "rxjs/operators";
import { Project } from "../api/projects/projects-api.interfaces";
import { ProjectsAPIService } from "../api/projects/projects-api.service";
import { StatefulService } from "../shared/stateful-service/signal-state.service";
import { toObservable } from "@angular/core/rxjs-interop";

interface ProjectsState {
  projects: Project[] | null;
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
  private projectsAPIService = inject(ProjectsAPIService);

  projects = computed(() => this.state().projects);
  projects$ = toObservable(this.projects);
  initialLoadComplete = computed(() => this.state().initialLoadComplete);
  initialLoadComplete$ = toObservable(this.initialLoadComplete);
  loading = computed(() => this.state().loading);
  loading$ = toObservable(this.loading);

  constructor() {
    super(initialState);
  }

  retrieveProjects() {
    this.setState({ loading: true });
    this.projectsAPIService
      .list()
      .pipe(tap((projects) => this.setProjects(projects)))
      .subscribe();
  }

  private setProjects(projects: Project[]) {
    this.setState({ projects, initialLoadComplete: true, loading: false });
  }
}
