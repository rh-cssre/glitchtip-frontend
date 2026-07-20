import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { client } from "src/app/shared/api/api";

@Injectable()
export class MergedService {
  orgSlug = signal<string | undefined>(undefined);
  issueID = signal<number | undefined>(undefined);
  selectedHashes = signal<string[]>([]);
  private snackbar = inject(MatSnackBar);
  private hashesResource = resource({
    params: () => ({ issueID: this.issueID(), orgSlug: this.orgSlug() }),
    loader: async ({ params }) => {
      if (!params.issueID || !params.orgSlug) {
        return undefined;
      }
      const { data, error } = await client.GET(
        "/api/0/organizations/{organization_slug}/issues/{issue_id}/hashes/",
        {
          params: {
            path: {
              issue_id: params.issueID,
              organization_slug: params.orgSlug,
            },
          },
        },
      );
      if (error) {
        this.snackbar.open(
          $localize`Something went wrong. Try reloading the page.`,
        );
      }
      return data;
    },
  });
  hashes = computed(() => this.hashesResource.value() || []);

  setParams(orgSlug: string, issueID: string) {
    this.orgSlug.set(orgSlug);
    this.issueID.set(+issueID);
  }

  toggleHash(hashId: string) {
    this.selectedHashes.update((selectedHashes) => {
      if (selectedHashes.includes(hashId)) {
        return selectedHashes.filter((hash) => hash !== hashId);
      }
      return selectedHashes.concat([hashId]);
    });
  }

  /** Unmerge selected hash IDs. Do not unmerge all hashes of a single issue. */
  async unmerge() {
    const orgSlug = this.orgSlug();
    const issueID = this.issueID();
    const hashIDs = this.selectedHashes();
    if (!issueID || !orgSlug || !hashIDs.length) {
      return;
    }
    if (hashIDs.length === this.hashes().length) {
      console.warn("Attempted to unmerge all hashes on an issue.");
      return;
    }
    const { response, error } = await client.DELETE(
      "/api/0/organizations/{organization_slug}/issues/{issue_id}/hashes/",
      {
        params: {
          path: { organization_slug: orgSlug, issue_id: issueID },
          query: { id: hashIDs },
        },
      },
    );
    if (error) {
      this.snackbar.open($localize`Unable to unmerge selected hashes.`);
    }
    if (response.status === 202) {
      this.selectedHashes.set([]);
      this.hashesResource.reload();
      this.snackbar.open($localize`Unmerged seleced hashes.`);
    }
  }
}
