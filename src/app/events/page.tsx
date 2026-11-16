import type { Metadata } from "next";
import { PageHeader, Container } from "@/components/site/page-header";
import { PrototypeBadge } from "@/components/ui/badge";
import { EventList } from "@/components/event-list";

export const metadata: Metadata = { title: "Events & Tournaments" };

export default function EventsPage() {
  return (
    <>
      <PageHeader eyebrow="Compete" title="Events & tournaments" description="From casual blitz arenas to a $20,000 championship — find your next battle.">
        <PrototypeBadge label="Registration is simulated" />
      </PageHeader>
      <Container className="py-10"><EventList /></Container>
    </>
  );
}
