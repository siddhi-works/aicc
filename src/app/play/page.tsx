import { Suspense } from "react";
import type { Metadata } from "next";
import { Game } from "@/components/chess/game";
import { Container } from "@/components/site/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Play" };

async function GameFromParams({ searchParams }: { searchParams: Promise<{ tc?: string; mode?: string }> }) {
  const sp = await searchParams;
  return <Game initialTc={sp.tc} initialMode={sp.mode === "local" ? "local" : "bot"} />;
}

export default function PlayPage({ searchParams }: { searchParams: Promise<{ tc?: string; mode?: string }> }) {
  return (
    <Container className="py-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-2xl font-semibold">Play</h1>
        <Badge variant="green">Computer & same-screen multiplayer</Badge>
      </div>
      <Suspense fallback={<div className="aspect-square max-w-[640px] animate-pulse rounded-xl bg-surface" />}>
        <GameFromParams searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
