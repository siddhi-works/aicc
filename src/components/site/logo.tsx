import Link from "next/link";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#ff9f2e" />
      <path
        d="M9 25h14v-2H9v2Zm1-3h12l-1-9h2V9h-2v2h-2V9h-2v2h-2V9h-2v2h-2V9H9v4h2l-1 9Z"
        fill="#1a1305"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group" aria-label="All India Chess Club home">
      <span className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <LogoMark />
      </span>
      <span className="font-serif text-base font-semibold leading-tight tracking-tight sm:text-lg">
        All India <span className="text-gold">Chess Club</span>
      </span>
    </Link>
  );
}
