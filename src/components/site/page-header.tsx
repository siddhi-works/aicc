import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border", className)}>
      <div className="bg-board-pattern absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="absolute -top-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 animate-fade-up">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>}
        <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto max-w-7xl px-4 sm:px-6", className)} {...props} />;
}
