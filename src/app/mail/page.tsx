import ThemeToggle from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import ComposeButton from "./compose-button";

const Mail = dynamic(
  () => {
    return import("./mail");
  },
  {
    ssr: false,
  },
);

export default function PageMail() {
  return (
    <>
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2">
          <UserButton />
          <ThemeToggle />
          <ComposeButton />
        </div>
      </div>
      <Mail
        defaultLayout={[23, 30, 47]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      ></Mail>
    </>
  );
}
