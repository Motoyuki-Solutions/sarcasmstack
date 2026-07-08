import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <span className="font-mono text-sm text-accent">404</span>
      <h1 className="mt-4 font-display text-6xl tracking-tight text-white sm:text-8xl">
        WRONG PAGE.
      </h1>
      <p className="mt-4 max-w-md text-zinc-400">
        Either this page doesn&apos;t exist or it offended us. Possibly both.
        There&apos;s only one way to find out and we&apos;re not going to.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-display text-lg tracking-wide text-ink-950 transition-all hover:bg-accent-soft"
      >
        BACK TO THE GOODS →
      </Link>
    </div>
  );
}
