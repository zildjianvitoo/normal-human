"use client";
import { getAurinkoUrl } from "@/lib/aurinko";
import { Button } from "./ui/button";
// import { auth } from "@clerk/nextjs/server";

export default function LinkAccountButton() {
  const handleClick = async () => {
    const authUrl = await getAurinkoUrl("Google");
    console.log(authUrl);
    window.location.href = authUrl;
  };

  return <Button onClick={handleClick}>Link Account</Button>;
}
