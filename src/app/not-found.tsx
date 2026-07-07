import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl font-extrabold text-brand-600">404</h1>
      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-neutral-400">
        This page is as lost as your motivation on a Monday morning.
      </p>
      <Link
        href="/" 
        className="mt-8 rounded-full bg-brand-600 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
