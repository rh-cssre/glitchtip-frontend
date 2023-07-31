import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { Product } from "./subscriptions.interfaces";

@Injectable({
  providedIn: "root",
})
export class ProductsAPIService {
  readonly url = `${baseUrl}/products/`;
  constructor(protected http: HttpClient) {}

  list() {
    return this.http.get<Product[]>(this.url);
  }
}
