import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { isAuthed } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !isAuthed()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
