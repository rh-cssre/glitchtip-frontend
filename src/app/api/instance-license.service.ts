import { computed, Injectable } from "@angular/core";
import { apiResource } from "../shared/api/api-resource-factory";

@Injectable({
  providedIn: "root",
})
export class InstanceLicenseService {
  #instanceLicenseResource = apiResource(() => ({
    url: "/api/0/instance-license/",
  }));

  billingEmail = computed(
    () => this.#instanceLicenseResource.value()?.billingEmail ?? "",
  );
}
