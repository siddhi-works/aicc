import type { Metadata } from "next";
import { Target, Eye, Brain, Zap, Users, Smile } from "lucide-react";
import { PageHeader, Container } from "@/components/site/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Our Vision & Mission" };

const values = [
  { icon: Brain, t: "A busy mind is a happy mind", d: "Every game is a small workout for focus, memory and planning." },
  { icon: Zap, t: "Sharper every day", d: "Think a move ahead, then two. Small habits build a sharp mind." },
  { icon: Users, t: "Everyone gets a seat", d: "Kids, parents and grandparents. Beginners are as welcome as champions." },
  { icon: Smile, t: "Fun first", d: "Winning is nice. Enjoying the game is the point." },
];

export default function VisionPage() {
  return (
    <>
      <PageHeader eyebrow="Vision & mission" title="Keep minds active, curious and sharp — one game at a time." />
      <Container className="grid gap-6 py-14 md:grid-cols-2">
        <Card className="border-gold/60 bg-gradient-to-br from-gold/15 to-surface">
          <CardContent className="p-8">
            <Eye className="mb-4 size-8 text-gold" />
            <h2 className="font-serif text-2xl font-semibold">Our vision</h2>
            <p className="mt-3 text-lg text-muted">A country where every home has a chessboard and every person, young or old, has a way to keep their mind stimulated and sharp.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-8">
            <Target className="mb-4 size-8 text-gold" />
            <h2 className="font-serif text-2xl font-semibold">Our mission</h2>
            <p className="mt-3 text-lg text-muted">To make chess easy to start, pleasant to play and rewarding to learn — with simple tools, patient lessons and a friendly place to practise your thinking.</p>
          </CardContent>
        </Card>
      </Container>
      <Container>
        <h2 className="font-serif text-3xl font-semibold">Why we started</h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">We are a mama–bhaanji team. We began with one hope: that a simple game could keep the mind stimulated and sharp, at any age. That hope still guides every page we build.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.t} className="transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <v.icon className="mb-3 size-6 text-gold" />
                <h3 className="font-serif text-lg font-semibold">{v.t}</h3>
                <p className="mt-1 text-sm text-muted">{v.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
