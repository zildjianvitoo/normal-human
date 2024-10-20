import ThemeToggle from "@/components/theme-toggle";
import dynamic from "next/dynamic";

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
        <ThemeToggle />
      </div>
      <Mail
        defaultLayout={[20, 30, 48]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      ></Mail>
    </>
  );
}
