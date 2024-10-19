"use client";
import { getAurinkoUrl } from "@/lib/aurinko";
import { Button } from "./ui/button";

export default function LinkAccountButton() {
  const handleClick = async () => {
    const authUrl = await getAurinkoUrl("Google");
    window.location.href = authUrl;
  };

  return <Button onClick={handleClick}>Link Account</Button>;
}
