import { Injectable, computed } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { apiResource } from "../shared/api/api-resource-factory";

@Injectable({
  providedIn: "root",
})
export class ProjectsService {
  #projectsResource = apiResource.fetchAll(() => ({ url: "/api/0/projects/" }));
  projects = computed(() => this.#projectsResource.value() || []);
  projects$ = toObservable(this.projects);
  loading = computed(() => this.#projectsResource.isLoading());
  initialLoadComplete = computed(
    () => this.#projectsResource.hasValue() || !this.loading(),
  );

  retrieveProjects() {
    this.#projectsResource.reload();
  }
}
