import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Receipt,
  Trash2,
  Boxes,
  Wallet,
  FileBarChart,
  Files,
  Settings,
  MoreHorizontal,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sales", label: "Sales", icon: ShoppingCart },
  { to: "/purchases", label: "Purchases", icon: Truck },
  { to: "/stock", label: "Chicken Stock", icon: Boxes },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/wastage", label: "Wastage", icon: Trash2 },
  { to: "/cash", label: "Cash & Online", icon: Wallet },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/documents", label: "Bills & Documents", icon: Files },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const MOBILE_NAV = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/sales", label: "Sales", icon: ShoppingCart },
  { to: "/purchases", label: "Buy", icon: Truck },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/more", label: "More", icon: MoreHorizontal },
] as const;

export function AppShell() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const navigate = useNavigate();
  const qc = useQueryClient();

  function signOut() {
    // Demo logout
    localStorage.removeItem("demo_logged_in");

    // Clear cached application data
    qc.clear();

    // Go back to login page
    navigate({
      to: "/auth",
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-sidebar lg:flex lg:flex-col">

        {/* Brand */}
        <div className="border-b px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
            Brothers
          </p>

          <h1 className="text-xl font-bold">
            Chicken Adda
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            Bengaluru, Karnataka
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const activeItem = pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeItem
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Sign Out */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={signOut}
          >
            <LogOut className="size-[18px]" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-primary">
            Brothers
          </p>

          <h1 className="text-base font-bold">
            Chicken Adda
          </h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          aria-label="Sign out"
        >
          <LogOut className="size-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="pb-24 lg:ml-64 lg:pb-8">
        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card/95 backdrop-blur lg:hidden">
        {MOBILE_NAV.map((item) => {
          const activeItem = pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                activeItem
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}