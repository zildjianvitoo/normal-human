"use client";
import {
  type Action,
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  Priority,
} from "kbar";

import { useLocalStorage } from "usehooks-ts";

import { useAtom } from "jotai";

import { useThread } from "@/hooks/use-thread";
import { isSearchingAtom } from "@/app/mail/search-bar";
import useThemeSwitching from "@/hooks/use-theme-swtiching";
import useAccountSwitching from "@/hooks/use-account-switching";
import RenderResults from "./render-result";
import { type ReactNode } from "react";

export default function KBar({ children }: { children: ReactNode }) {
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
  const [_, setTab] = useLocalStorage(`normalhuman-tab`, "inbox");
  const [threadId, setThreadId] = useThread();
  const [done, setDone] = useLocalStorage("normalhuman-done", false);

  const actions: Action[] = [
    {
      id: "inboxAction",
      name: "Inbox",
      shortcut: ["g", "i"],
      keywords: "inbox",
      section: "Navigation",
      subtitle: "View your inbox",
      perform: () => {
        setTab("inbox");
      },
    },
    {
      id: "draftsAction",
      name: "Draft",
      shortcut: ["g", "d"],
      keywords: "draft",
      priority: Priority.HIGH,
      subtitle: "View your drafts",
      section: "Navigation",
      perform: () => {
        setTab("draft");
      },
    },
    {
      id: "sentAction",
      name: "Sent",
      shortcut: ["g", "s"],
      keywords: "sent",
      section: "Navigation",
      subtitle: "View the sent",
      perform: () => {
        setTab("sent");
      },
    },
    {
      id: "pendingAction",
      name: "See done",
      shortcut: ["g", "d"],
      keywords: "done",
      section: "Navigation",
      subtitle: "View the done emails",
      perform: () => {
        setDone(true);
      },
    },
    {
      id: "doneAction",
      name: "See Pending",
      shortcut: ["g", "u"],
      keywords: "pending, undone, not done",
      section: "Navigation",
      subtitle: "View the pending emails",
      perform: () => {
        setDone(false);
      },
    },
  ];
  return (
    <KBarProvider actions={actions}>
      <ActualComponent>{children}</ActualComponent>
    </KBarProvider>
  );
}
function ActualComponent({ children }: { children: React.ReactNode }) {
  useAccountSwitching();
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide fixed inset-0 z-[99999] bg-black/40 !p-0 backdrop-blur-sm dark:bg-black/60">
          <KBarAnimator className="relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg border bg-white text-foreground shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <div className="bg-white dark:bg-gray-800">
              <div className="border-x-0 border-b-2 dark:border-gray-700">
                <KBarSearch className="w-full border-none bg-white px-6 py-4 text-lg outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 dark:bg-gray-800" />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
}
