"use client";
import * as React from "react";
import Link from "next/link";
import { Check, MapPin, Calendar, Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/site/page-header";
import { useProfile } from "@/lib/profile-context";
import { countries, openings, ratingHistory, recentGames } from "@/lib/mock";
import { cn } from "@/lib/utils";

const swatches = ["#ff9f2e", "#46b88c", "#6c8cff", "#e0596a", "#b07cf0", "#e8884d"];

function RatingChart({ data }: { data: number[] }) {
  const min = Math.min(...data) - 20, max = Math.max(...data) + 20;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 300, 80 - ((v - min) / (max - min)) * 76 - 2]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 300 80" className="h-32 w-full" role="img" aria-label={`Rating history from ${data[0]} to ${data[data.length - 1]}`} preserveAspectRatio="none">
      <defs><linearGradient id="rg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ff9f2e" stopOpacity=".35" /><stop offset="1" stopColor="#ff9f2e" stopOpacity="0" /></linearGradient></defs>
      <path d={`${line} L300,80 L0,80 Z`} fill="url(#rg)" />
      <path d={line} fill="none" stroke="#ff9f2e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ProfileView() {
  const { profile, ready, update } = useProfile();
  const [saved, setSaved] = React.useState(false);
  const [color, setColor] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  if (!ready) return <Container className="py-20 text-muted">Loading…</Container>;
  if (!profile)
    return (
      <Container className="grid place-items-center py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">You're not signed in</h1>
        <p className="mt-2 text-muted">Log in or create a (demo) account to see your profile.</p>
        <div className="mt-6 flex gap-3"><Button asChild><Link href="/login">Log in</Link></Button><Button asChild variant="outline"><Link href="/register">Sign up</Link></Button></div>
      </Container>
    );

  const avatarColor = color ?? profile.avatarColor;
  const wins = recentGames.filter((g) => g.result === "Win").length;

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const username = String(f.get("username")).trim();
    const displayName = String(f.get("displayName")).trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) return setErr("Username must be 3–20 letters, numbers or underscores.");
    if (!displayName) return setErr("Display name can't be empty.");
    setErr(null);
    update({
      username, displayName, avatarColor,
      bio: String(f.get("bio")).slice(0, 240),
      country: String(f.get("country")),
      favoriteOpening: String(f.get("favoriteOpening")),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const stats = [
    ["Rating", profile.rating + 90, TrendingUp],
    ["Games", 248, Calendar],
    ["Win rate", "54%", Check],
    ["Best streak", 7, Flame],
  ] as const;

  return (
    <>
      <section className="relative border-b border-border">
        <div className="bg-board-pattern absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <Container className="relative flex flex-wrap items-center gap-6 py-12">
          <Avatar name={profile.displayName} color={profile.avatarColor} size={96} />
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-4xl font-semibold">{profile.displayName}</h1>
            <p className="text-muted">@{profile.username}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1"><MapPin className="size-4" />{profile.country}</span>
              <span className="flex items-center gap-1"><Calendar className="size-4" />Joined {profile.joined}</span>
            </p>
          </div>
          <Button asChild><Link href="/play">Play a game</Link></Button>
        </Container>
      </section>

      <Container className="py-10">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="edit">Edit profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map(([l, v, Icon]) => (
                <Card key={l}><CardContent className="p-5"><Icon className="mb-2 size-4 text-gold" /><p className="font-serif text-3xl">{v}</p><p className="text-xs uppercase tracking-wider text-muted">{l}</p></CardContent></Card>
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2"><CardHeader><CardTitle>Rating history</CardTitle></CardHeader><CardContent><RatingChart data={ratingHistory} /><p className="text-xs text-muted">Mock data</p></CardContent></Card>
              <Card><CardHeader><CardTitle>About</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><p className="text-muted">{profile.bio || "No bio yet."}</p><p><span className="text-muted">Favourite opening:</span> {profile.favoriteOpening}</p></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="games">
            <Card><CardContent className="overflow-x-auto p-2 sm:p-4">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-muted"><tr><th className="p-3 font-medium">Opponent</th><th className="font-medium">Result</th><th className="font-medium">Opening</th><th className="font-medium">Time</th><th className="font-medium">Moves</th><th className="font-medium">Δ</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {recentGames.map((g, i) => (
                    <tr key={i} className="hover:bg-white/[0.03]">
                      <td className="p-3"><span className="flex items-center gap-2"><Avatar name={g.opp} size={26} />{g.opp} <span className="text-muted">({g.rating})</span></span></td>
                      <td><Badge variant={g.result === "Win" ? "green" : g.result === "Loss" ? "red" : "default"}>{g.result}</Badge></td>
                      <td className="text-muted">{g.opening}</td><td>{g.tc}</td><td>{g.moves}</td>
                      <td className={cn("font-mono", g.delta.startsWith("+") ? "text-emerald" : "text-ruby")}>{g.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="p-3 text-xs text-muted">Sample history ({wins} wins in last {recentGames.length}). Mock data.</p>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="edit">
            <Card className="max-w-2xl"><CardContent className="p-6">
              <form onSubmit={onSave} className="grid gap-5 sm:grid-cols-2" noValidate>
                <div className="space-y-1.5"><Label htmlFor="displayName">Display name</Label><Input id="displayName" name="displayName" defaultValue={profile.displayName} maxLength={40} /></div>
                <div className="space-y-1.5"><Label htmlFor="username">Username</Label><Input id="username" name="username" defaultValue={profile.username} /></div>
                <div className="space-y-1.5"><Label htmlFor="country">Country</Label><Select id="country" name="country" defaultValue={profile.country}>{countries.map((c) => <option key={c}>{c}</option>)}</Select></div>
                <div className="space-y-1.5"><Label htmlFor="favoriteOpening">Favourite opening</Label><Select id="favoriteOpening" name="favoriteOpening" defaultValue={profile.favoriteOpening}>{openings.map((c) => <option key={c}>{c}</option>)}</Select></div>
                <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" name="bio" defaultValue={profile.bio} maxLength={240} /></div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Avatar colour</Label>
                  <div className="flex items-center gap-3">
                    <Avatar name={profile.displayName} color={avatarColor} size={48} />
                    {swatches.map((s) => (
                      <button type="button" key={s} onClick={() => setColor(s)} aria-label={`Colour ${s}`} aria-pressed={avatarColor === s}
                        className={cn("size-8 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110", avatarColor === s && "ring-2 ring-gold")} style={{ background: s }} />
                    ))}
                  </div>
                </div>
                {err && <p role="alert" className="text-sm text-ruby sm:col-span-2">{err}</p>}
                <div className="flex items-center gap-3 sm:col-span-2">
                  <Button type="submit">Save changes</Button>
                  {saved && <span className="flex items-center gap-1 text-sm text-emerald" role="status"><Check className="size-4" />Saved</span>}
                </div>
              </form>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </Container>
    </>
  );
}
