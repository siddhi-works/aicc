import type { Metadata } from "next";
import { Target, Eye, Brain, Zap, Users, Smile } from "lucide-react";
import { PageHeader, Container } from "@/components/site/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Our Vision & Mission" };

const values = [
  { icon: Brain, t: "Mental stimulation", d: "Each game exercises focus, memory and planning." },
  { icon: Zap, t: "Steady improvement", d: "Regular practice builds clearer, more disciplined thinking." },
  { icon: Users, t: "Open to all", d: "Players of every age and level are welcome." },
  { icon: Smile, t: "Enjoyment", d: "The aim is to enjoy the game, not only to win it." },
];

export default function VisionPage() {
  return (
    <>
      <PageHeader eyebrow="Vision & mission" title="Keeping minds active, curious and sharp through chess." />
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
        <p className="mt-3 max-w-2xl text-lg text-muted">We began with one belief: that a simple game can keep the mind stimulated and sharp at any age. That belief continues to guide every feature we build.</p>
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
