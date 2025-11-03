import { computed, Injectable, resource, signal } from "@angular/core";
import { client } from "src/app/shared/api/api";

@Injectable()
export class TransactionGroupDetailService {
  #params = signal<{ orgSlug: string; id: number } | undefined>(undefined);
  #transactionGroupResource = resource({
    params: () => ({ params: this.#params() }),
    loader: async ({ params }) => {
      if (!params.params) {
        return undefined;
      }
      const { data } = await client.GET(
        "/api/0/organizations/{organization_slug}/transaction-groups/{id}/",
        {
          params: {
            path: {
              organization_slug: params.params.orgSlug,
              id: params.params.id,
            },
          },
        },
      );
      return data;
    },
  });

  setParams(orgSlug: string, id: number) {
    this.#params.set({ orgSlug, id });
  }
  transactionGroup = computed(() => this.#transactionGroupResource.value());
  loading = computed(() => this.#transactionGroupResource.isLoading());
  initialLoadComplete = computed(
    () =>
      this.#transactionGroupResource.hasValue() ||
      !this.#transactionGroupResource.isLoading(),
  );
}
