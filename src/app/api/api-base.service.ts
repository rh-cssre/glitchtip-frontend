import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface APIBaseService {
  update(
    id: unknown,
    obj: unknown,
    slug1?: unknown,
    slug2?: unknown
  ): Observable<unknown>;
  create(obj: unknown, slug1?: string, slug2?: string): Observable<unknown>;
  destroy(id: string, slug1?: string, slug2?: string): Observable<unknown>;
}

/**
 * Base API Service that represents a Django Rest Framework ViewSet
 * may include additional slugs for nested viewsets
 * This API should represent the ViewSet exactly as is even when it deviates from typical
 * JS conventions. Code outside of this service, should match JS conventions.
 */
export abstract class APIBaseService {
  abstract url: string;
  constructor(protected http: HttpClient) {}

  abstract list(slug1?: string, slug2?: string): Observable<unknown>;
  abstract retrieve(
    id: string | number,
    slug1?: string,
    slug2?: string
  ): Observable<unknown>;

  protected detailURL(id: string | number, slug1?: string, slug2?: string) {
    return this.url + id + "/";
  }
}
