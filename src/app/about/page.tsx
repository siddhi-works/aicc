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
        title="A chess platform built to keep minds active and sharp."
        description="All India Chess Club is an independent project created to make chess accessible, enjoyable and educational for players of every age and level."
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4 text-lg leading-relaxed text-muted">
          <h2 className="font-serif text-3xl font-semibold text-foreground">Who we are</h2>
          <p>All India Chess Club was founded on a simple conviction: regular practice of chess strengthens concentration, memory and strategic thinking, and these benefits should be available to everyone.</p>
          <p>The platform brings together play against the computer, same-screen multiplayer, structured lessons for beginners and the ability to save and resume games. Each feature is designed to be clear, dependable and easy to use.</p>
          <p>We continue to develop the platform with a focus on quality, accessibility and a respectful playing environment.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild><Link href="/play">Play a game</Link></Button>
            <Button asChild variant="outline"><Link href="/vision">Our vision and mission</Link></Button>
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
