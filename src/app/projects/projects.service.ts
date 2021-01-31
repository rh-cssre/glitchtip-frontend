import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Project } from "../api/projects/projects-api.interfaces";
import { ProjectsAPIService } from "../api/projects/projects-api.service";
import { StatefulService } from "../shared/stateful-service/stateful-service";

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
  readonly projects$ = this.getState$.pipe(map((data) => data.projects));
  readonly initialLoadComplete$ = this.getState$.pipe(
    map((state) => state.initialLoadComplete)
  );
  readonly loading$ = this.getState$.pipe(map((state) => state.loading));

  constructor(private projectsAPIService: ProjectsAPIService) {
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
