import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    // DEMO LOGIN
    if (userId === "brothers" && password === "12345678") {
      localStorage.setItem("demo_logged_in", "true");

      toast.success("Login successful!");

      setTimeout(() => {
        navigate({ to: "/dashboard", replace: true });
      }, 300);
    } else {
      toast.error("Invalid User ID or Password");
    }

    setBusy(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06271b] p-4">
      <div className="w-full max-w-md">

        <div className="text-center text-white mb-6">
          <p className="text-xs tracking-[0.3em] text-green-400">
            BROTHERS
          </p>

          <h1 className="text-3xl font-bold">
            Chicken Adda
          </h1>

          <p className="text-sm text-gray-300 mt-2">
            Private business management system
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">

          <form onSubmit={submit} className="space-y-5">

            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>

              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="h-12"
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full text-base"
              disabled={busy}
            >
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              Sign in
            </Button>

          </form>

        </div>

      </div>
    </div>
  );
}