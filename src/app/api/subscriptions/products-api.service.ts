import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { baseUrl } from "../../constants";
import { Product } from "./subscriptions.interfaces";

@Injectable({
  providedIn: "root",
})
export class ProductsAPIService {
  protected http = inject(HttpClient);

  readonly url = `${baseUrl}/products/`;

  list() {
    return this.http.get<Product[]>(this.url);
  }
}
