import { DevConsole } from "@/features/dev/DevConsole";
import { env } from "@/lib/env";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dev Console — Flowdex",
  description: "API playground and route simulation for developers.",
};

export default function DevPage() {
  if (!env.features.devMode) redirect("/swap");
  return <DevConsole />;
}
