import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Ticket,
  Mail,
  Bell,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const items = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Building2 },
  { title: "Tickets", url: "/tickets", icon: Ticket },
  { title: "Communication Hub", url: "/communication", icon: Mail },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

const iconOnlyButtonClass = (isItemActive: boolean, collapsed: boolean) =>
  cn(
    "rounded-lg font-medium transition-colors",
    "hover:bg-blue-50 hover:text-blue-700",
    collapsed && [
      "!size-10 !p-0",
      "flex items-center justify-center",
      "[&>span]:hidden",
      "[&>a]:flex [&>a]:size-full [&>a]:items-center [&>a]:justify-center",
    ],
    isItemActive &&
      "bg-blue-600 text-white hover:bg-blue-600 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white",
  );

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const active = (url: string) => path === url || path.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader
        className={cn(
          "border-b border-sidebar-border",
          collapsed ? "px-2 py-4" : "px-2 py-2",
        )}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-sidebar-border"
              title="J2W"
            >
              <img
                src="/J2W_Logo.png"
                alt="J2W"
                className="h-9 w-9 object-contain"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <img
              src="/J2W_Logo.png"
              alt="J2W Logo"
              className="h-9 w-9 shrink-0 rounded-lg object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight text-foreground">
                J2W&apos;s HRBP
              </p>
              <p className="text-xs text-muted-foreground">System</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className={cn(collapsed && "overflow-visible px-2")}>
        <SidebarGroup className={cn(collapsed ? "p-0" : "p-2")}>
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu
              className={cn(collapsed && "items-center gap-2 py-1")}
            >
              {items.map((it) => (
                <SidebarMenuItem
                  key={it.url}
                  className={cn(collapsed && "flex justify-center")}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={active(it.url)}
                    tooltip={it.title}
                    className={iconOnlyButtonClass(active(it.url), collapsed)}
                  >
                    <Link to={it.url}>
                      <it.icon className="!size-[18px] shrink-0" />
                      {!collapsed && <span>{it.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          "border-t border-sidebar-border",
          collapsed ? "px-2 py-3" : "p-2",
        )}
      >
        <SidebarMenu className={cn(collapsed && "items-center gap-2")}>
          <SidebarMenuItem className={cn(collapsed && "flex justify-center")}>
            <SidebarMenuButton
              tooltip={user?.name ?? "Profile"}
              className={cn(
                "rounded-lg",
                collapsed && [
                  "!size-10 !p-0",
                  "flex items-center justify-center",
                  "[&>span]:hidden",
                ],
              )}
            >
              <User className="!size-[18px] shrink-0" />
              {!collapsed && (
                <div className="flex min-w-0 flex-col items-start text-left leading-tight">
                  <span className="truncate text-sm font-semibold">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user?.role}</span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className={cn(collapsed && "flex justify-center")}>
            <SidebarMenuButton
              tooltip="Logout"
              className={cn(
                "rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600",
                collapsed && [
                  "!size-10 !p-0",
                  "flex items-center justify-center",
                  "[&>span]:hidden",
                ],
              )}
              onClick={() => {
                logout();
                nav({ to: "/login" });
              }}
            >
              <LogOut className="!size-[18px] shrink-0" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
