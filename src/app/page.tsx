import Link from "next/link";
import { ArrowRight, Swords, Trophy, Users, Zap, Bot, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, PrototypeBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Container } from "@/components/site/page-header";
import { HeroBoard } from "@/components/chess/hero-board";
import { events, leaderboard, lobbyGames } from "@/lib/mock";

const stats = [
  ["2.4M", "Games played"],
  ["180K", "Active players"],
  ["120+", "Countries"],
  ["350", "Tournaments / yr"],
];

const features = [
  { icon: Swords, title: "Play instantly", text: "Local two-player and bot games with legal-move hints, clocks and full history — live today.", href: "/play", tag: "Live" },
  { icon: Users, title: "Multiplayer lobby", text: "Create challenges, browse open seats and pair up with players worldwide.", href: "/lobby", tag: "Prototype" },
  { icon: Trophy, title: "Tournaments", text: "Swiss, arena and knockout events with real prizes and friendly pairings.", href: "/events", tag: "Mock data" },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-board-pattern absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
        <div className="absolute -left-40 top-20 size-[500px] rounded-full bg-emerald/10 blur-3xl" aria-hidden />
        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <Badge variant="gold" className="mb-5"><Zap className="size-3" />Season 4 is live</Badge>
            <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Play chess.<br /><span className="bg-gradient-to-r from-gold-soft to-gold bg-clip-text text-transparent">Think deeper.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted">
              All India Chess Club is a calmer, sharper home for chess — a beautiful board, honest clocks and a community that
              loves the game as much as you do.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/play">Play now <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/learn">Learn chess</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href="/play#saved">Saved games</Link></Button>
            </div>
            <p className="mt-4 text-xs text-muted">No sign-up needed for local and bot games.</p>
          </div>
          <div className="mx-auto w-full max-w-[520px]"><HeroBoard /></div>
        </Container>
      </section>

      <Container>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l} className="bg-surface px-6 py-6 text-center">
              <dt className="font-serif text-3xl font-semibold text-gold-soft">{n}</dt>
              <dd className="mt-1 text-xs uppercase tracking-widest text-muted">{l}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-center text-[11px] text-muted">Illustrative figures for this demo.</p>
      </Container>

      <Container className="mt-20">
        <h2 className="font-serif text-3xl font-semibold">Everything a chess player needs</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <Link key={f.title} href={f.href} className="group">
              <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold/50 group-hover:shadow-[0_20px_50px_-20px_rgb(255_159_46/0.4)]">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-gold/10 text-gold"><f.icon className="size-5" /></span>
                    {f.tag === "Live" ? <Badge variant="green">Live</Badge> : <PrototypeBadge label={f.tag} />}
                  </div>
                  <h3 className="font-serif text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted">{f.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold opacity-0 transition-opacity group-hover:opacity-100">Open <ArrowRight className="size-4" /></span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="mt-20 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold"><Globe className="size-5 text-gold" />Open games</h2>
              <PrototypeBadge />
            </div>
            <ul className="divide-y divide-border">
              {lobbyGames.slice(0, 4).map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="flex items-center gap-3"><Avatar name={g.host} size={34} /><span><span className="font-medium">{g.host}</span> <span className="text-muted">({g.rating})</span></span></span>
                  <span className="flex items-center gap-3 text-sm text-muted"><Badge>{g.tc}</Badge>{g.mode}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="secondary" className="mt-4"><Link href="/lobby">Go to lobby</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl font-semibold"><Trophy className="size-5 text-gold" />Top players</h2>
            <ol className="space-y-3">
              {leaderboard.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-3"><span className="w-4 text-muted">{i + 1}</span><Avatar name={p.name} size={28} />{p.name}</span>
                  <span className="font-mono text-gold-soft">{p.rating}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </Container>

      <Container className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-serif text-3xl font-semibold">Upcoming events</h2>
          <Link href="/events" className="text-sm font-semibold text-gold hover:underline">All events →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {events.slice(0, 3).map((e) => (
            <Card key={e.id} className="transition-colors hover:border-gold/40">
              <CardContent className="p-5">
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold"><Calendar className="size-3.5" />{e.date}</p>
                <h3 className="mt-2 font-serif text-lg font-semibold">{e.title}</h3>
                <p className="mt-1 text-sm text-muted">{e.format} · {e.tc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      <Container className="mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-surface to-surface p-10 text-center sm:p-14">
          <Bot className="mx-auto mb-4 size-8 text-gold" />
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Your move.</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Make a free profile to track your rating, or jump straight into a game.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link href="/register">Create account</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/play">Play as guest</Link></Button>
          </div>
        </div>
      </Container>
    </>
  );
}
