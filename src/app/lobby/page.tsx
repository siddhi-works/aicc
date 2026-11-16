import type { Metadata } from "next";
import { PageHeader, Container } from "@/components/site/page-header";
import { PrototypeBadge } from "@/components/ui/badge";
import { Lobby } from "@/components/lobby";

export const metadata: Metadata = { title: "Multiplayer Lobby" };

export default function LobbyPage() {
  return (
    <>
      <PageHeader eyebrow="Multiplayer" title="Find a game" description="Create a challenge or join one from the list.">
        <PrototypeBadge label="Prototype — no real opponents" />
      </PageHeader>
      <Container className="py-10">
        <Lobby />
      </Container>
    </>
  );
}
