// api/aurinko/callback

import { exhcangeCodeForAccessToken, getAccountDetail } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  console.log("userId", userId);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const status = params.get("status");

  if (status !== "success") {
    return NextResponse.json(
      { message: "Failed link account" },
      { status: 400 },
    );
  }

  //Get the code to exchange for accessToken
  const code = params.get("code");
  if (!code) {
    return NextResponse.json({ message: "No code provided" }, { status: 400 });
  }
  const token = await exhcangeCodeForAccessToken(code);

  if (!token) {
    return NextResponse.json(
      { message: "Error exchange token" },
      { status: 400 },
    );
  }

  const accountDetails = await getAccountDetail(token.accessToken);

  await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId: userId,
      email: accountDetails?.email!,
      name: accountDetails?.name!,
      accessToken: token.accessToken,
    },
  });

  // Trigger initial hit endpoint
  // Run async (wait atleast 30 secs)
  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId: userId,
      })
      .then((res) => {
        console.log("Initial sync triggered", res.data);
      })
      .catch((error) => {
        console.error("Failed trigger initial sync", error);
      }),
  );

  return NextResponse.redirect(new URL("/mail", req.url));
}
