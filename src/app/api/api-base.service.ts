import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface APIBaseService {
  update(id: any, obj: any, slug1?: string, slug2?: string): Observable<any>;
  create(obj: any, slug1?: string, slug2?: string): Observable<any>;
}

/**
 * Base API Service that represents a Django Rest Framework ViewSet
 * may include additional slugs for nested viewsets
 * This API should represent the ViewSet exactly as is even when it deviates from typical
 * JS conventions. Code outside of this service, should match JS conventions.
 */
export abstract class APIBaseService {
  abstract readonly url: string;
  constructor(protected http: HttpClient) {}

  abstract list(slug1?: string, slug2?: string): Observable<any>;
  abstract retrieve(
    id: string,
    slug1?: string,
    slug2?: string
  ): Observable<any>;
  abstract destroy(id: string, slug1?: string, slug2?: string): Observable<any>;

  protected detailURL(id: string, slug1?: string, slug2?: string) {
    return this.url + id + "/";
  }
}
