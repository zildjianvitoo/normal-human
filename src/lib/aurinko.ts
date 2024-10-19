"use server";

import { auth } from "@clerk/nextjs/server";
import axios, { AxiosError } from "axios";

export async function getAurinkoUrl(serviceType: "Google" | "Office365") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID! as string,
    serviceType,
    scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
  });

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
}

export async function exhcangeCodeForAccessToken(code: string) {
  try {
    const { data } = await axios.post(
      `https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID! as string,
          password: process.env.AURINKO_CLIENT_SECRET! as string,
        },
      },
    );
    return data as {
      accountId: string;
      accessToken: string;
      userId: string;
      userSession: string;
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.response?.data);
    }
    console.error(error);
  }
}

export async function getAccountDetail(accessToken: string) {
  try {
    const { data } = await axios.get("http://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data as {
      email: string;
      name: string;
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.response?.data);
    }
    console.error(error);
  }
}
