import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import {
  CreateSubscriptionResp,
  EventsCount,
  Subscription,
} from "./subscriptions.interfaces";

@Injectable({
  providedIn: "root",
})
export class SubscriptionsAPIService {
  readonly url = `${baseUrl}/subscriptions/`;
  constructor(protected http: HttpClient) {}

  create(organizationId: number, priceId: string) {
    const data = {
      organization: organizationId,
      price: priceId,
    };
    return this.http.post<CreateSubscriptionResp>(this.url, data);
  }

  retrieve(slug: string) {
    return this.http.get<Subscription>(this.detailURL(slug));
  }

  retrieveEventsCount(organizationSlug: string) {
    return this.http.get<EventsCount>(this.eventsCountUrl(organizationSlug));
  }

  protected detailURL(organizationSlug: string) {
    return `${this.url}${organizationSlug}/`;
  }

  protected eventsCountUrl(organizationSlug: string) {
    return `${this.detailURL(organizationSlug)}events_count/`;
  }
}
