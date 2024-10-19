// /api/initial-sync

import { Account } from "@/lib/account";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { accountId, userId } = await req.json();
  if (!accountId || !userId) {
    return NextResponse.json(
      { error: "Missing Account or User Id" },
      { status: 400 },
    );
  }

  const dbAccount = await db.account.findUnique({
    where: {
      id: accountId,
      userId: userId,
    },
  });

  if (!dbAccount) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const account = new Account(dbAccount.accessToken);

  // perform inital sync
  const response = await account.performInitialSync();

  if (!response) {
    return NextResponse.json(
      { error: "Failed perform initial sync" },
      { status: 500 },
    );
  }

  const { emails, deltaToken } = response;
  console.log(emails);

  //   await db.account.update({
  //     where: {
  //       id: accountId,
  //     },
  //     data: {
  //       nextDeltaToken: deltaToken,
  //     },
  //   });

  console.log("Sync Completed", deltaToken);
  return NextResponse.json({ success: true }, { status: 200 });
}
