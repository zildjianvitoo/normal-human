import type {
  EmailMessage,
  SyncResponse,
  SyncUpdatedResponse,
} from "@/types/types";
import axios, { AxiosError } from "axios";

export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async startSync() {
    const { data } = await axios.post<SyncResponse>(
      "https://api.aurinko.io/v1/email/sync",
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          daysWithin: 2, // Get 2 days last inbox meessage
          bodyType: "html",
        },
      },
    );

    return data;
  }

  async getUpdatedEmail({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }) {
    const params: Record<string, string> = {};

    if (deltaToken) params.deltaToken = deltaToken;
    if (pageToken) params.pageToken = pageToken;

    const { data } = await axios.get<SyncUpdatedResponse>(
      "https://api.aurinko.io/v1/email/sync/updated",
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: params,
      },
    );

    return data;
  }

  async performInitialSync() {
    try {
      // Start sync process
      let syncResponse = await this.startSync();
      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync();
      }

      console.log("Sync is ready");

      // Get bookmark delta token
      let storedDeltaToken: string = syncResponse.syncUpdatedToken;

      let updatedResponse = await this.getUpdatedEmail({
        deltaToken: storedDeltaToken,
      });

      if (updatedResponse.nextDeltaToken) {
        // Sync completed
        storedDeltaToken = updatedResponse.nextDeltaToken;
      }
      let allEmails: EmailMessage[] = updatedResponse.records;

      while (updatedResponse.nextPageToken) {
        updatedResponse = await this.getUpdatedEmail({
          pageToken: updatedResponse.nextPageToken,
        });
        allEmails = allEmails.concat(updatedResponse.records);
        if (updatedResponse.nextDeltaToken) {
          // Sync ended
          storedDeltaToken = updatedResponse.nextDeltaToken;
        }
      }

      console.log("Initial sync completed", allEmails.length, "email");

      // Stored the latest delta token for future incremental sync
      //   await this.getUpdatedEmail({deltaToken: delta})

      return {
        emails: allEmails,
        deltaToken: storedDeltaToken,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error during sync", error.response?.data);
      } else {
        console.error("Error during sync", error);
      }
    }
  }
}
