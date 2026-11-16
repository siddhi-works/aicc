"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Loader2, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, Label } from "@/components/ui/input";
import { Badge, PrototypeBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { lobbyGames, timeControls } from "@/lib/mock";
import { useProfile } from "@/lib/profile-context";

type Game = (typeof lobbyGames)[number];

/**
 * PROTOTYPE lobby: there is no server. "Joining" a seeded game or finishing a
 * quick pairing simply starts a local game vs the built-in bot.
 */
export function Lobby() {
  const router = useRouter();
  const { profile } = useProfile();
  const [games, setGames] = React.useState<Game[]>(lobbyGames);
  const [tc, setTc] = React.useState("5+0");
  const [mode, setMode] = React.useState("Casual");
  const [color, setColor] = React.useState("Random");
  const [filter, setFilter] = React.useState("all");
  const [seeking, setSeeking] = React.useState<string | null>(null);
  const [mine, setMine] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const start = (tcId: string) => router.push(`/play?mode=bot&tc=${encodeURIComponent(tcId)}`);

  const create = () => {
    const g: Game = {
      id: `mine-${Date.now()}`,
      host: profile?.username ?? "You (guest)",
      rating: profile?.rating ?? 1500,
      tc, mode, color, country: profile?.country ?? "—",
    };
    setGames((gs) => [g, ...gs]);
    setMine(g.id);
  };

  const quickPair = (tcId: string) => {
    setSeeking(tcId);
    timer.current = setTimeout(() => start(tcId), 1800);
  };

  const cancelSeek = () => {
    if (timer.current) clearTimeout(timer.current);
    setSeeking(null);
  };

  const visible = games.filter((g) => filter === "all" || g.tc === filter);
  const quick = ["1+0", "3+2", "5+0", "10+0", "15+10", "30+0"];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Zap className="size-4 text-gold" />Quick pairing</CardTitle>
              <CardDescription>Pick a time control and we'll find you an opponent.</CardDescription>
            </div>
            <PrototypeBadge />
          </CardHeader>
          <CardContent>
            {seeking ? (
              <div className="flex items-center justify-between rounded-xl border border-gold/40 bg-gold/5 p-4" role="status">
                <span className="flex items-center gap-3"><Loader2 className="size-5 animate-spin text-gold" />Searching {seeking} opponents…</span>
                <Button variant="ghost" size="sm" onClick={cancelSeek}><X />Cancel</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {quick.map((id) => {
                  const t = timeControls.find((x) => x.id === id)!;
                  return (
                    <button key={id} onClick={() => quickPair(id)} className="rounded-xl border border-border bg-surface-2 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-gold/60">
                      <p className="font-serif text-2xl">{id}</p>
                      <p className="text-xs uppercase tracking-wider text-muted">{t.label}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle>Open challenges</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="size-4 text-muted" aria-hidden />
              <Select aria-label="Filter by time control" className="h-8 w-36 text-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All time controls</option>
                {timeControls.map((t) => <option key={t.id} value={t.id}>{t.id} · {t.label}</option>)}
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-muted">
                  <tr><th className="py-2 font-medium">Player</th><th className="font-medium">Rating</th><th className="font-medium">Time</th><th className="font-medium">Mode</th><th className="font-medium">Color</th><th /></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visible.map((g) => (
                    <tr key={g.id} className="transition-colors hover:bg-white/[0.03]">
                      <td className="py-3"><span className="flex items-center gap-2.5"><Avatar name={g.host} size={30} />{g.host}</span></td>
                      <td className="font-mono text-gold-soft">{g.rating}</td>
                      <td><Badge>{g.tc}</Badge></td>
                      <td>{g.mode}</td>
                      <td className="text-muted">{g.color}</td>
                      <td className="text-right">
                        {g.id === mine ? (
                          <span className="flex justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => start(g.tc)}>Start vs bot</Button>
                            <Button size="sm" variant="ghost" aria-label="Remove challenge" onClick={() => { setGames((gs) => gs.filter((x) => x.id !== g.id)); setMine(null); }}><X /></Button>
                          </span>
                        ) : (
                          <Button size="sm" onClick={() => start(g.tc)}>Join</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!visible.length && <tr><td colSpan={6} className="py-10 text-center text-muted">No challenges for that time control. Create one!</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted">These challenges are fictional. Joining starts a local game against the built-in bot.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="size-4 text-gold" />Create a challenge</CardTitle>
          <CardDescription>It appears in the list for this session only.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label htmlFor="c-tc">Time control</Label>
            <Select id="c-tc" value={tc} onChange={(e) => setTc(e.target.value)}>{timeControls.map((t) => <option key={t.id} value={t.id}>{t.id} · {t.label}</option>)}</Select></div>
          <div className="space-y-1.5"><Label htmlFor="c-mode">Mode</Label>
            <Select id="c-mode" value={mode} onChange={(e) => setMode(e.target.value)}><option>Casual</option><option>Rated</option></Select></div>
          <div className="space-y-1.5"><Label htmlFor="c-color">Play as</Label>
            <Select id="c-color" value={color} onChange={(e) => setColor(e.target.value)}><option>Random</option><option>White</option><option>Black</option></Select></div>
          <Button className="w-full" onClick={create} disabled={!!mine}>{mine ? "Challenge posted" : "Create challenge"}</Button>
          {!profile && <p className="text-xs text-muted">Posting as guest. Sign in to use your name and rating.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
