"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useProfile } from "@/lib/profile-context";
import { cn } from "@/lib/utils";

const links = [
  { href: "/play", label: "Play" },
  { href: "/learn", label: "Learn" },
  { href: "/lobby", label: "Lobby" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/vision", label: "Vision" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { profile, ready, signOut } = useProfile();

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-gold-soft" : "text-muted hover:text-foreground",
                )}
              >
                {l.label}
                {active && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gold" />}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 xl:flex">
          {!ready ? null : profile ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/5">
                <Avatar name={profile.displayName} color={profile.avatarColor} size={30} />
                <span className="text-sm font-medium">{profile.username}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
                <LogOut />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/login">Log in</Link></Button>
              <Button asChild><Link href="/register">Sign up</Link></Button>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="xl:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="border-t border-border bg-background xl:hidden animate-fade-up">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-4" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-3 text-base font-medium hover:bg-white/5">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-border pt-4">
              {profile ? (
                <>
                  <Button asChild variant="secondary" className="flex-1"><Link href="/profile"><User />Profile</Link></Button>
                  <Button variant="outline" onClick={signOut}>Sign out</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="secondary" className="flex-1"><Link href="/login">Log in</Link></Button>
                  <Button asChild className="flex-1"><Link href="/register">Sign up</Link></Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
