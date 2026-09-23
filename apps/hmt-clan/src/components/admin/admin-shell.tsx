"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sessionAvatarUrl } from "@/lib/auth/avatar";
import type { SessionUser } from "@/lib/auth/session";
import { ToastProvider } from "@/components/admin/toast";
import StagingButton from "@/components/admin/staging-button";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/crew", label: "Crew", icon: Users },
  { href: "/admin/seasons", label: "Seasons", icon: Layers },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(href + "/");
}

function useCloseOnNavigation(onClose: () => void) {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onClose();
  }, [pathname, onClose]);
}

function SidebarContent({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="border-b border-black/40 p-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2.5"
          onClick={onNavigate}
        >
          <span className="rounded-block border border-black/50 bg-surface-3 p-1 shadow-block">
            <Image
              src="/logo.png"
              alt="HMT Clan Logo"
              width={28}
              height={28}
              className="size-7"
            />
          </span>
          <span className="font-pixel text-[11px] uppercase leading-tight tracking-[0.12em] text-foreground">
            HMT Clan
            <span className="block text-grass">Admin</span>
          </span>
        </Link>
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-base px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border border-black/50 bg-surface-3 text-grass"
                  : "border border-transparent text-muted hover:bg-surface-3 hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/40 p-3">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-base px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-3 hover:text-foreground"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          View Website
        </Link>
      </div>
    </div>
  );
}

function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const avatarUrl = sessionAvatarUrl(user, 64);
  const displayName = user.globalName ?? user.username;

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Benutzermenü öffnen"
        className="flex items-center gap-2.5 rounded-base border border-black/50 bg-surface-3 p-1.5 pr-3 transition-colors hover:bg-surface-hover"
      >
        <Image
          src={avatarUrl}
          alt=""
          width={28}
          height={28}
          className="size-7 rounded-full border border-black/50"
          unoptimized
        />
        <span className="hidden max-w-[10rem] truncate text-sm text-foreground sm:block">
          {displayName}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Benutzermenü"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-lift animate-in fade-in zoom-in-95"
        >
          <div className="border-b border-black/40 px-4 py-3">
            <p className="truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted">Administrator</p>
          </div>
          <div className="p-1.5">
            <Link
              href="/admin/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-base px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Settings className="size-4" aria-hidden="true" />
              Account & Settings
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-base px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              View Website
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-base px-3 py-2 text-sm text-redstone transition-colors hover:bg-surface-2"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  useCloseOnNavigation(() => setDrawerOpen(false));

  return (
    <ToastProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-black/40 bg-secondary-background/80 backdrop-blur-md lg:block">
          <SidebarContent />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Menü schließen"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-overlay backdrop-blur-[2px]"
            />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-black/60 bg-surface-3 shadow-lift animate-in slide-in-from-left fade-in">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Menü schließen"
                className="absolute right-3 top-4 rounded-base p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-5" />
              </button>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-black/40 bg-[#0b0e0b]/85 px-4 backdrop-blur-md md:px-6">
            <button
              type="button"
              onClick={() => setDrawerOpen((value) => !value)}
              aria-label="Menü öffnen"
              className="inline-flex size-9 items-center justify-center rounded-base border border-black/50 bg-surface-3 text-foreground transition-colors hover:bg-surface-hover lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            <span className="hidden font-pixel text-[10px] uppercase tracking-[0.14em] text-muted md:block">
              Admin Dashboard
            </span>

            <div className="ml-auto flex items-center gap-3">
              <StagingButton />
              <UserMenu user={user} />
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}