"use client";
import React from "react";

import { File, Inbox, Send } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { api } from "@/trpc/react";
import { Nav } from "./nav";
interface Props {
  isCollapsed: boolean;
}

const SideBar = ({ isCollapsed }: Props) => {
  const [tab] = useLocalStorage("normalhuman-tab", "inbox");
  const [accountId] = useLocalStorage("accountId", "");

  const refetchInterval = 5000;
  const { data: inboxThreads } = api.account.getNumThreads.useQuery(
    {
      accountId,
      tab: "inbox",
    },
    { enabled: !!accountId && !!tab, refetchInterval },
  );

  const { data: draftsThreads } = api.account.getNumThreads.useQuery(
    {
      accountId,
      tab: "draft",
    },
    { enabled: !!accountId && !!tab, refetchInterval },
  );

  const { data: sentThreads } = api.account.getNumThreads.useQuery(
    {
      accountId,
      tab: "sent",
    },
    { enabled: !!accountId && !!tab, refetchInterval },
  );

  return (
    <>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Inbox",
            label: inboxThreads?.toString() ?? "0",
            icon: Inbox,
            variant: tab === "inbox" ? "default" : "ghost",
          },
          {
            title: "Draft",
            label: draftsThreads?.toString() ?? "0",
            icon: File,
            variant: tab === "draft" ? "default" : "ghost",
          },
          {
            title: "Sent",
            label: sentThreads?.toString() ?? "0",
            icon: Send,
            variant: tab === "sent" ? "default" : "ghost",
          },
        ]}
      />
    </>
  );
};

export default SideBar;
