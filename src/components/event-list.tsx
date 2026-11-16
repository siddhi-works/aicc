"use client";
import * as React from "react";
import { Calendar, Clock, Trophy, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { events } from "@/lib/mock";
import { cn } from "@/lib/utils";

const filters = [
  ["all", "All"],
  ["Open", "Open"],
  ["Soon", "Coming soon"],
  ["Finished", "Finished"],
] as const;

const statusVariant = { Open: "green", Full: "red", Soon: "gold", Finished: "default" } as const;

export function EventList() {
  const [joined, setJoined] = React.useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setJoined((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const featured = events.find((e) => e.featured)!;

  const card = (e: (typeof events)[number]) => {
    const isIn = joined.has(e.id);
    const count = e.players + (isIn ? 1 : 0);
    const pct = Math.min(100, (count / e.cap) * 100);
    const canJoin = e.status === "Open" || isIn;
    return (
      <Card key={e.id} className="flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-gold/40">
        <CardContent className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <Badge variant={statusVariant[e.status as keyof typeof statusVariant]}>{e.status}</Badge>
            <Badge>{e.tc}</Badge>
          </div>
          <h3 className="font-serif text-xl font-semibold">{e.title}</h3>
          <p className="mt-1 text-sm text-gold-soft">{e.format}</p>
          <p className="mt-3 flex-1 text-sm text-muted">{e.desc}</p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted">
            <li className="flex items-center gap-2"><Calendar className="size-4 text-gold" />{e.date}</li>
            <li className="flex items-center gap-2"><Clock className="size-4 text-gold" />{e.time}</li>
            <li className="flex items-center gap-2"><Trophy className="size-4 text-gold" />{e.prize}</li>
          </ul>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-muted"><span className="flex items-center gap-1"><Users className="size-3" />{count} / {e.cap}</span><span>{Math.round(pct)}%</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-soft transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          </div>
          <Button className="mt-5" variant={isIn ? "secondary" : "default"} disabled={!canJoin} onClick={() => toggle(e.id)}>
            {isIn ? <><Check />Registered — click to leave</> : e.status === "Open" ? "Register" : e.status === "Full" ? "Full" : e.status === "Soon" ? "Opens soon" : "Ended"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-surface to-surface p-8 sm:p-10">
        <Badge variant="gold">Featured</Badge>
        <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">{featured.title}</h2>
        <p className="mt-2 max-w-xl text-muted">{featured.desc}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2"><Calendar className="size-4 text-gold" />{featured.date} · {featured.time}</span>
          <span className="flex items-center gap-2"><Trophy className="size-4 text-gold" />{featured.prize} prize pool</span>
          <span className="flex items-center gap-2"><Users className="size-4 text-gold" />{featured.players + (joined.has(featured.id) ? 1 : 0)} registered</span>
        </div>
        <Button size="lg" className="mt-6" variant={joined.has(featured.id) ? "secondary" : "default"} onClick={() => toggle(featured.id)}>
          {joined.has(featured.id) ? <><Check />You're in</> : "Register now"}
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap h-auto">
          {filters.map(([v, l]) => <TabsTrigger key={v} value={v}>{l}</TabsTrigger>)}
        </TabsList>
        {filters.map(([v]) => (
          <TabsContent key={v} value={v}>
            <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3")}>
              {events.filter((e) => v === "all" || e.status === v || (v === "Open" && e.status === "Full")).map(card)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
