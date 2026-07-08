"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CATEGORY_FILTERS } from "@/data/catalog";

/**
 * Client-side category filter. Updates the `?category=` query param and lets
 * Next.js re-run the server component with the new filter.
 */
export function CategoryFilter({ active }: { active: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const setActive = useCallback(
    (slug: string) => {
      const next = new URLSearchParams(params.toString());
      if (slug === "all") {
        next.delete("category");
      } else {
        next.set("category", slug);
      }
      const qs = next.toString();
      router.push(qs ? `/shop?${qs}` : "/shop");
    },
    [params, router],
  );

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_FILTERS.map((f) => {
        const isActive = active === f.slug;
        return (
          <button
            key={f.slug}
            type="button"
            onClick={() => setActive(f.slug)}
            aria-pressed={isActive}
            className={
              "rounded-full border px-4 py-2 text-sm font-bold transition-all " +
              (isActive
                ? "border-accent bg-accent text-ink-950"
                : "border-white/10 bg-ink-900 text-zinc-400 hover:border-white/30 hover:text-white")
            }
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
