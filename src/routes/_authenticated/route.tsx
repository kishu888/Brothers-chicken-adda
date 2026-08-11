import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,

  beforeLoad: async () => {
    const loggedIn = localStorage.getItem("demo_logged_in");

    if (!loggedIn) {
      throw redirect({ to: "/auth" });
    }
  },

  component: AppShell,
});