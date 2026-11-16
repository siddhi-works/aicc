import type { Metadata } from "next";
import Link from "next/link";
import { Castle, Crown, Handshake, Lightbulb, Sparkles, Swords, Trophy } from "lucide-react";
import { PageHeader, Container } from "@/components/site/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Replay } from "@/components/learn/replay";
import { Reveal } from "@/components/learn/reveal";
import { PieceLesson } from "@/components/learn/piece-lesson";

export const metadata: Metadata = { title: "Learn Chess" };

const sp = (s: string) => s.split(" ");

const sections = [
  ["board", "The board"], ["pieces", "The pieces"], ["goal", "The goal"], ["special", "Special moves"],
  ["phases", "Game phases"], ["openings", "Famous openings"], ["games", "Legendary games"],
];

const values = [["Pawn", 1], ["Knight", 3], ["Bishop", 3], ["Rook", 5], ["Queen", 9]] as const;

const specials = [
  { title: "Castling", icon: Castle, fen: "r3k2r/pppq1ppp/2npbn2/2b1p3/2B1P3/2NPBN2/PPPQ1PPP/R3K2R w KQkq - 0 1", moves: ["O-O", "O-O-O"], text: "King and rook move together in one turn: the king hops two squares toward the rook and the rook jumps over it. Only allowed if neither has moved, the squares between are empty and the king isn't in or passing through check." },
  { title: "En passant", icon: Swords, fen: "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1", moves: ["exd6"], text: "If an enemy pawn jumps two squares and lands beside your pawn, you may capture it as if it had moved only one square — but only immediately, on the very next move." },
  { title: "Promotion", icon: Crown, fen: "7k/4P3/8/8/8/8/8/4K3 w - - 0 1", moves: ["e8=Q+"], text: "A pawn that reaches the far side of the board becomes a queen, rook, bishop or knight — your choice. Almost everyone picks the queen." },
];

const openings = [
  { name: "Queen's Gambit", moves: sp("d4 d5 c4"), text: "White offers a pawn to take control of the centre. Not a real gambit — Black can't safely keep it." },
  { name: "Sicilian Defense", moves: sp("e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6"), text: "Black's most popular reply to 1.e4. Sharp, unbalanced and full of fighting chances." },
  { name: "Ruy Lopez", moves: sp("e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O"), text: "One of the oldest openings, named after a 16th-century Spanish priest. Slow pressure on Black's centre." },
  { name: "Italian Game", moves: sp("e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3"), text: "Develop quickly and aim at the weak f7 square. A great first opening for beginners." },
  { name: "King's Gambit", moves: sp("e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5"), text: "The romantic opening of the 1800s: sacrifice a pawn for a fast attack." },
  { name: "French Defense", moves: sp("e4 e6 d4 d5 Nc3 Bb4 e5"), text: "Solid and strategic. Black builds a sturdy pawn chain and counterattacks later." },
  { name: "King's Indian", moves: sp("d4 Nf6 c4 g6 Nc3 Bg7 e4 d6"), text: "Black lets White take the centre, then strikes back at it. Loved by attacking players." },
  { name: "Caro-Kann", moves: sp("e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5"), text: "Rock-solid. Black develops the light bishop before locking the pawn chain." },
];

const games = [
  { id: "immortal", tab: "Immortal Game", head: "Anderssen vs Kieseritzky · London, 1851", text: "Adolf Anderssen sacrificed both rooks and his queen to deliver checkmate with just three minor pieces. It is the most famous attacking game ever played.", moves: sp("e4 e5 f4 exf4 Bc4 Qh4+ Kf1 b5 Bxb5 Nf6 Nf3 Qh6 d3 Nh5 Nh4 Qg5 Nf5 c6 g4 Nf6 Rg1 cxb5 h4 Qg6 h5 Qg5 Qf3 Ng8 Bxf4 Qf6 Nc3 Bc5 Nd5 Qxb2 Bd6 Bxg1 e5 Qxa1+ Ke2 Na6 Nxg7+ Kd8 Qf6+ Nxf6 Be7#") },
  { id: "opera", tab: "Opera Game", head: "Morphy vs Duke of Brunswick & Count Isouard · Paris, 1858", text: "Played during a performance of Norma. Paul Morphy shows textbook development and a crushing finish in 17 moves — the model of how to use your pieces.", moves: sp("e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#") },
  { id: "scholar", tab: "Scholar's Mate", head: "The 4-move trap", text: "Queen and bishop gang up on f7. Beginners fall for it often — now you know how to stop it: defend f7 and don't rush your queen out.", moves: sp("e4 e5 Qh5 Nc6 Bc4 Nf6 Qxf7#") },
  { id: "fool", tab: "Fool's Mate", head: "The fastest possible checkmate", text: "Two moves each. Black wins on move 2 because White opened the king's diagonal with f3 and g4. Never do this!", moves: sp("f3 e5 g4 Qh4#") },
];

const phases = [
  { icon: Sparkles, t: "1 · Opening", tips: ["Control the centre with pawns (e4, d4).", "Develop knights and bishops early.", "Castle to keep your king safe.", "Don't move the same piece twice without reason."] },
  { icon: Swords, t: "2 · Middlegame", tips: ["Make a plan: attack, defend or improve.", "Look for forks, pins and skewers.", "Connect your rooks.", "Before every move, check what your opponent threatens."] },
  { icon: Trophy, t: "3 · Endgame", tips: ["Activate your king — it's a strong piece now.", "Push passed pawns toward promotion.", "Rooks belong behind passed pawns.", "Learn the basic king-and-pawn endings."] },
];

function Heading({ id, n, title, sub }: { id: string; n: string; title: string; sub: string }) {
  return (
    <div id={id} className="mb-8 scroll-mt-28">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Lesson {n}</p>
      <h2 className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-muted">{sub}</p>
    </div>
  );
}

export default function LearnPage() {
  return (
    <>
      <PageHeader eyebrow="Learn chess" title="From first move to first checkmate." description="A visual, hands-on guide for complete beginners. Click, watch and try every idea on the board.">
        <div className="flex flex-wrap gap-2">
          {sections.map(([id, l]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-gold/60 hover:text-gold-soft">{l}</a>
          ))}
        </div>
      </PageHeader>

      <Container className="space-y-24 py-16">
        {/* 1 BOARD */}
        <section>
          <Heading id="board" n="1" title="The board" sub="Chess is played on an 8×8 grid of 64 alternating light and dark squares." />
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,520px)_1fr]">
            <Reveal><Replay moves={sp("e4 e5 Nf3 Nc6")} autoplay /></Reveal>
            <Reveal delay={150} className="space-y-4">
              {[
                ["Files & ranks", "Columns are files (a–h). Rows are ranks (1–8). Every square has a name like e4 — that's how moves are written."],
                ["Set-up", "White is at the bottom. Each player has 16 pieces: 1 king, 1 queen, 2 rooks, 2 bishops, 2 knights and 8 pawns."],
                ["Remember", "A light square sits in each player's bottom-right corner. The queen starts on her own colour."],
                ["Who moves first?", "White always goes first, then players alternate. You can't skip a turn."],
              ].map(([h, t]) => (
                <Card key={h}><CardContent className="p-4"><p className="font-serif text-lg text-gold-soft">{h}</p><p className="text-sm text-muted">{t}</p></CardContent></Card>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 2 PIECES */}
        <section>
          <Heading id="pieces" n="2" title="How the pieces move" sub="Pick a piece, then click the dotted squares to move it — or just watch the demo." />
          <Reveal><PieceLesson /></Reveal>
          <Reveal className="mt-12">
            <h3 className="font-serif text-2xl font-semibold">What are the pieces worth?</h3>
            <p className="mt-1 text-sm text-muted">Points help you judge trades. Trading a rook (5) for a knight (3) loses material.</p>
            <ul className="mt-5 space-y-3">
              {values.map(([n, v]) => (
                <li key={n} className="grid grid-cols-[5rem_1fr_3rem] items-center gap-3 text-sm">
                  <span className="text-muted">{n}</span>
                  <span className="h-3 overflow-hidden rounded-full bg-surface-2"><span className="block h-full rounded-full bg-gradient-to-r from-gold to-gold-soft" style={{ width: `${(v / 9) * 100}%` }} /></span>
                  <span className="font-mono text-gold-soft">{v}</span>
                </li>
              ))}
              <li className="text-xs text-muted">The king has no value — losing it loses the game.</li>
            </ul>
          </Reveal>
        </section>

        {/* 3 GOAL */}
        <section>
          <Heading id="goal" n="3" title="The goal: checkmate" sub="You win by trapping the enemy king so it cannot escape capture." />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Check", "The king is attacked. You must respond right away: move the king, block the attack or capture the attacker.", "green"],
              ["Checkmate", "The king is attacked and there is no escape. The game ends and the attacker wins.", "gold"],
              ["Stalemate / Draw", "If the player to move has no legal move but is NOT in check, it's a draw. Draws also happen by agreement, repetition or too few pieces.", "default"],
            ].map(([h, t, v]) => (
              <Reveal key={h}><Card className="h-full"><CardContent className="p-5"><Badge variant={v as "green"}>{h}</Badge><p className="mt-3 text-sm text-muted">{t}</p></CardContent></Card></Reveal>
            ))}
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Reveal><p className="mb-3 font-serif text-lg">Checkmate in two moves (Fool's Mate)</p><Replay moves={sp("f3 e5 g4 Qh4#")} className="max-w-md" /></Reveal>
            <Reveal delay={150}><p className="mb-3 flex items-center gap-2 font-serif text-lg"><Handshake className="size-5 text-gold" />Stalemate — Black can't move, but isn't in check</p><Replay fen="7k/8/6K1/8/8/8/5Q2/8 w - - 0 1" moves={["Qf7"]} className="max-w-md" /></Reveal>
          </div>
        </section>

        {/* 4 SPECIAL */}
        <section>
          <Heading id="special" n="4" title="Special moves" sub="Three rules that surprise every beginner. Press play to see each one." />
          <div className="grid gap-8 md:grid-cols-3">
            {specials.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <Card className="h-full"><CardContent className="space-y-4 p-5">
                  <h3 className="flex items-center gap-2 font-serif text-xl font-semibold"><s.icon className="size-5 text-gold" />{s.title}</h3>
                  <Replay fen={s.fen} moves={s.moves} />
                  <p className="text-sm text-muted">{s.text}</p>
                </CardContent></Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 5 PHASES */}
        <section>
          <Heading id="phases" n="5" title="The three phases of a game" sub="Every game flows from opening to middlegame to endgame. Here's what to focus on in each." />
          <div className="grid gap-6 md:grid-cols-3">
            {phases.map((p, i) => (
              <Reveal key={p.t} delay={i * 120}>
                <Card className="h-full transition-all hover:-translate-y-1 hover:border-gold/40"><CardContent className="p-6">
                  <p.icon className="mb-3 size-6 text-gold" />
                  <h3 className="font-serif text-xl font-semibold">{p.t}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted">{p.tips.map((t) => <li key={t} className="flex gap-2"><Lightbulb className="mt-0.5 size-4 shrink-0 text-gold" />{t}</li>)}</ul>
                </CardContent></Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 6 OPENINGS */}
        <section>
          <Heading id="openings" n="6" title="Famous openings" sub="Centuries-old move sequences that every player should recognise. Watch each one unfold." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {openings.map((o, i) => (
              <Reveal key={o.name} delay={(i % 4) * 100}>
                <Card className="h-full"><CardContent className="space-y-3 p-4">
                  <Replay moves={o.moves} />
                  <h3 className="font-serif text-lg font-semibold">{o.name}</h3>
                  <p className="font-mono text-xs text-gold-soft">{o.moves.slice(0, 4).join(" ")} …</p>
                  <p className="text-sm text-muted">{o.text}</p>
                </CardContent></Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 7 GAMES */}
        <section>
          <Heading id="games" n="7" title="Legendary games & famous finishes" sub="Replay history's most celebrated games move by move." />
          <Tabs defaultValue="immortal">
            <TabsList className="h-auto flex-wrap">{games.map((g) => <TabsTrigger key={g.id} value={g.id}>{g.tab}</TabsTrigger>)}</TabsList>
            {games.map((g) => (
              <TabsContent key={g.id} value={g.id}>
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,520px)_1fr]">
                  <Replay moves={g.moves} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{g.head}</p>
                    <p className="mt-3 text-lg text-muted">{g.text}</p>
                    <p className="mt-5 font-mono text-sm leading-relaxed text-foreground/80">
                      {g.moves.map((m, i) => <span key={i}>{i % 2 === 0 && <span className="text-muted">{i / 2 + 1}. </span>}{m}{" "}</span>)}
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <Reveal>
          <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-surface to-surface p-10 text-center">
            <h2 className="font-serif text-3xl font-semibold">Ready to play your first game?</h2>
            <p className="mx-auto mt-2 max-w-md text-muted">Start against the computer on Beginner level — no pressure, no clock.</p>
            <Button asChild size="lg" className="mt-6"><Link href="/play">Play now</Link></Button>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
