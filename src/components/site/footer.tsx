import Link from "next/link";
import { Logo } from "./logo";

const cols = [
  { title: "Play", links: [["Play", "/play"], ["Learn chess", "/learn"], ["Lobby", "/lobby"], ["Events", "/events"]] },
  { title: "Company", links: [["About us", "/about"], ["Vision & mission", "/vision"]] },
  { title: "Account", links: [["Log in", "/login"], ["Sign up", "/register"], ["Profile", "/profile"]] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted">
            A calmer, sharper home for chess. Local play is live; online multiplayer is a prototype.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">{c.title}</h4>
            <ul className="space-y-2 text-sm">
              {c.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-muted transition-colors hover:text-foreground">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted">
        © 2026 All India Chess Club. A demo project — all players, players and events are fictional.
      </div>
    </footer>
  );
}
