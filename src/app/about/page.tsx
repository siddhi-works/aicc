import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Container } from "@/components/site/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { team } from "@/lib/mock";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Two people, one board, a lot of chai."
        description="All India Chess Club is a family project — a mama and bhaanji who love sitting down to a good game."
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4 text-lg leading-relaxed text-muted">
          <h2 className="font-serif text-3xl font-semibold text-foreground">Our story</h2>
          <p>It started the way many chess stories start: a board on the table, one of us setting up the pieces, the other saying "one more game." Those games turned into long evenings, and the evenings turned into an idea.</p>
          <p>We wanted a place where anyone — a school kid, a parent, a grandparent — could play, learn and feel their mind wake up a little. No noise, no pressure. Just a good board and a good game.</p>
          <p>So we built one. It is small, it is honest, and we are still adding to it every week.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild><Link href="/play">Play a game</Link></Button>
            <Button asChild variant="outline"><Link href="/vision">Our vision & mission</Link></Button>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-3xl font-semibold">The team</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {team.map((name) => (
              <Card key={name} className="transition-transform hover:-translate-y-1">
                <CardContent className="flex items-center gap-4 p-5">
                  <Avatar name={name} size={64} />
                  <h3 className="font-serif text-2xl font-semibold">{name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
