import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface APIBaseService {
  update(id: any, obj: any): Observable<any>;
  create(obj: any): Observable<any>;
}

export abstract class APIBaseService {
  abstract readonly url: string;
  constructor(protected http: HttpClient) {}

  abstract list(): Observable<any>;
  abstract retrieve(id: string): Observable<any>;
  abstract destroy(id: string): Observable<any>;

  protected detailURL(id: string) {
    return this.url + id + "/";
  }
}
