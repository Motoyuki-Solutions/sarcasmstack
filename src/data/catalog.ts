/**
 * SarcasmStack product catalog — REAL data.
 *
 * 35 products mapped to Printify draft products in shop 28152719.
 * Pricing reflects the brief's tier table. Design images are the rasterized
 * PNGs in /designs/png/<kind>/ (committed to the repo).
 *
 * Printify product ids + blueprint/provider ids are baked in here so the
 * checkout → order flow can create a Printify order without a live lookup.
 * printifyVariantId is left null per variant until the sync script resolves
 * real variant ids from the Printify catalog; the order flow falls back to
 * a default variant when null (see src/lib/orders.ts).
 */

import type { Product, ProductVariant, ProductKind, CategoryFilter } from "@/types";

/* ------------------------------------------------------------------ */
/* Variant presets per product kind                                   */
/* ------------------------------------------------------------------ */

const TEE_SIZES: { id: string; label: string; priceCents: number }[] = [
  { id: "s", label: "S", priceCents: 2999 },
  { id: "m", label: "M", priceCents: 2999 },
  { id: "l", label: "L", priceCents: 2999 },
  { id: "xl", label: "XL", priceCents: 2999 },
  { id: "2xl", label: "2XL", priceCents: 3199 },
  { id: "3xl", label: "3XL", priceCents: 3399 },
];

const HOODIE_SIZES: { id: string; label: string; priceCents: number }[] = [
  { id: "s", label: "S", priceCents: 4499 },
  { id: "m", label: "M", priceCents: 4499 },
  { id: "l", label: "L", priceCents: 4499 },
  { id: "xl", label: "XL", priceCents: 4499 },
  { id: "2xl", label: "2XL", priceCents: 4699 },
];

const MUG_VARIANT: { id: string; label: string; priceCents: number } = {
  id: "11oz",
  label: "11oz",
  priceCents: 1499,
};

const STICKER_VARIANT: { id: string; label: string; priceCents: number } = {
  id: "3x3",
  label: '3" x 3"',
  priceCents: 399,
};

const POSTER_SIZES: { id: string; label: string; priceCents: number }[] = [
  { id: "12x18", label: '12" x 18"', priceCents: 1799 },
  { id: "16x20", label: '16" x 20"', priceCents: 1999 },
];

const variants = (preset: { id: string; label: string; priceCents: number }[]): ProductVariant[] =>
  preset.map((p) => ({ ...p, printifyVariantId: null }));

/* ------------------------------------------------------------------ */
/* Product definitions                                                */
/* ------------------------------------------------------------------ */

interface ProductSeed {
  id: string;
  title: string;
  tagline: string;
  description: string;
  kind: ProductKind;
  blueprintId: number;
  printProviderId: number;
  printifyProductId: string;
  /** Image stem under /designs/png/<kind>/, e.g. "01-trained-replacement". */
  imageStem: string;
  hasBack?: boolean;
  tags: string[];
}

const TEES: ProductSeed[] = [
  { id: "trained-replacement-tee", title: "I Trained My Replacement", tagline: "...and all I got was this lousy severance.", description: "Front: the headline. Back: ChatGPT says I'm still valuable as a 'creative collaborator.' I do the crying, it does the coding.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9d909a0edbf1560cfe93", imageStem: "01-trained-replacement", hasBack: true, tags: ["ai", "work"] },
  { id: "async-update-tee", title: "This Could Have Been an Async Update", tagline: "But sure, let's have a sync.", description: "Front: the headline. Back: I attended 12 syncs today. My only sync was with my keyboard.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9db53ac83974f90d0410", imageStem: "02-async-update", hasBack: true, tags: ["meetings", "work"] },
  { id: "mute-button-hero-tee", title: "Mute Button Hero", tagline: "Promotion incoming.", description: "Front: the headline. Back: I've been on mute for 3 years. Nobody's noticed. Promotion incoming.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9de221aceaf34e088e76", imageStem: "03-mute-button-hero", hasBack: true, tags: ["meetings", "work"] },
  { id: "cve-therapy-tee", title: "CVE-2026-XXXX: Found in Production, Fixed in Therapy", tagline: "CVSS 9.8. Coping 10.0.", description: "Front: the headline. Back: It's not a vulnerability. It's a feature we haven't documented yet.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9e00d023be308b09adc1", imageStem: "04-cve-therapy", hasBack: true, tags: ["security", "work"] },
  { id: "cloud-bill-tee", title: "My Cloud Bill Has More Digits Than My Salary", tagline: "Cost savings, they said.", description: "Front: the headline. Back: We migrated to the cloud for cost savings.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9e1bef9faaaa370233d9", imageStem: "05-cloud-bill", hasBack: true, tags: ["cloud", "work"] },
  { id: "my-kubernetes-tee", title: "It Works on My Kubernetes", tagline: "CrashLoopBackOff and so am I.", description: "Front: the headline. Back: Just scale it horizontally. That fixes everything, right?", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9e3b9a0edbf1560cfede", imageStem: "06-my-kubernetes", hasBack: true, tags: ["cloud", "dev"] },
  { id: "printf-debugger-tee", title: "printf Debugger", tagline: "I know there are better tools. I don't care.", description: "Front: printf(\"here\\n\"); x47. Back: the tagline.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9e5efecfb263540f0c94", imageStem: "07-printf-debugger", hasBack: true, tags: ["dev", "debugging"] },
  { id: "ai-attended-meeting-tee", title: "The AI Attended the Meeting So I Didn't Have To", tagline: "It promoted itself.", description: "Front: the headline. Back: It summarized the action items. It assigned them to me. It promoted itself.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9e7e069947de98041a89", imageStem: "08-ai-attended-meeting", hasBack: true, tags: ["ai", "meetings"] },
  { id: "ai-took-my-job-tee", title: "AI TOOK MY JOB", tagline: "Just kidding.", description: "Front: the headline. Back: Just kidding, it hallucinated the entire Exchange migration and now nothing works. I'm still here at 3am.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9ea4347b30b396039458", imageStem: "09-ai-took-my-job", hasBack: true, tags: ["ai", "oncall"] },
  { id: "oncall-chic-tee", title: "ON-CALL CHIC — ALWAYS", tagline: "I've seen things.", description: "Front: the headline. Back: I've seen things you people wouldn't believe. Alerts firing at 4am. A dev who ran rm -rf in prod. All those moments will be lost in time, like tickets in ServiceNow.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9ec2bf0ea22e610f2949", imageStem: "10-oncall-chic", hasBack: true, tags: ["oncall", "work"] },
  { id: "meeting-venn-tee", title: "Meeting Venn Diagram", tagline: "My calendar is a horror anthology.", description: "Front: two circles — 'meetings I could have skipped' and 'meetings about the meetings' — overlap at 'all of them'. Back: the tagline.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9ee69a0edbf1560cff6a", imageStem: "11-meeting-venn", hasBack: true, tags: ["meetings", "work"] },
  { id: "patch-tuesday-tee", title: "PATCH TUESDAY SURVIVOR", tagline: "My print spooler did not.", description: "Front: the headline. Back: I deployed the patches. I survived. My print spooler did not.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9f0b21aceaf34e088f3c", imageStem: "12-patch-tuesday", hasBack: true, tags: ["security", "work"] },
  { id: "cloud-costs-tee", title: "The Cloud Is Someone Else's Computer", tagline: "And invoice.", description: "Front: the headline + 'and apparently someone else's invoice'. Back: EXISTING — $47,000/mo.", kind: "tshirt", blueprintId: 12, printProviderId: 29, printifyProductId: "6a4d9f2abf0ea22e610f29bd", imageStem: "13-someone-elses-computer", hasBack: true, tags: ["cloud", "work"] },
];

const HOODIES: ProductSeed[] = [
  { id: "human-in-loop-hoodie", title: "Human in the Loop", tagline: "The one who gets paged.", description: "Front: the headline. Back: I'm not a human in the loop. I'm the human who gets paged at 3am when the loop breaks.", kind: "hoodie", blueprintId: 458, printProviderId: 26, printifyProductId: "6a4d9f8a21aceaf34e088f6c", imageStem: "14-human-in-loop", hasBack: true, tags: ["ai", "oncall"] },
  { id: "senior-sysadmin-hoodie", title: "Senior Systems Administrator", tagline: "Apparently worth six figures.", description: "Front: the headline. Back: I don't know how it works either, I just know how to fix it when it breaks, and that's apparently worth six figures.", kind: "hoodie", blueprintId: 458, printProviderId: 26, printifyProductId: "6a4d9fa30e46eb97410dcd54", imageStem: "15-senior-sysadmin", hasBack: true, tags: ["work", "dev"] },
  { id: "business-continuity-hoodie", title: "Business Continuity", tagline: "Hope. Blame the intern. That's it.", description: "Front: small fire logo. Back: MY BACKUP STRATEGY: 1. Hope 2. Blame the intern 3. That's it.", kind: "hoodie", blueprintId: 458, printProviderId: 26, printifyProductId: "6a4d9fc1ac9d726eeb0eb8e2", imageStem: "16-business-continuity", hasBack: true, tags: ["work", "oncall"] },
];

const MUGS: ProductSeed[] = [
  { id: "sure-let-ai-mug", title: "Sure, Let the AI Do It", tagline: "Holds 12oz of coping mechanism.", description: "Exterior: the headline. Interior: a production outage screenshot.", kind: "mug", blueprintId: 68, printProviderId: 1, printifyProductId: "6a4da14e347b30b396039686", imageStem: "17-let-ai-do-it", tags: ["ai", "drinkware"] },
  { id: "lets-circle-back-mug", title: "Let's Circle Back", tagline: "Your prize is another meeting.", description: "Exterior: the headline. Interior: You won. Your prize is another meeting.", kind: "mug", blueprintId: 68, printProviderId: 1, printifyProductId: "6a4da15d0e46eb97410dcec2", imageStem: "18-circle-back", tags: ["meetings", "drinkware"] },
  { id: "zero-trust-zero-sleep-mug", title: "Zero Trust, Zero Sleep", tagline: "Alert fatigue is a myth, right?", description: "Wrap: the headline + 'Alert fatigue is a myth, right?'", kind: "mug", blueprintId: 68, printProviderId: 1, printifyProductId: "6a4d9fdbef9faaaa370234ff", imageStem: "19-zero-trust-zero-sleep", tags: ["security", "drinkware"] },
  { id: "read-the-error-mug", title: "Have You Tried Reading the Error Message?", tagline: "Line 142. Always line 142.", description: "Wrap: the headline + 'Line 142. The answer is always line 142.'", kind: "mug", blueprintId: 68, printProviderId: 1, printifyProductId: "6a4d9ff0fecfb263540f0da0", imageStem: "20-read-the-error", tags: ["dev", "drinkware"] },
  { id: "production-incident-mug", title: "Production Incident", tagline: "This is my SEV-1. There are many like it.", description: "Wrap: Full-Metal-Jacket-style parody text.", kind: "mug", blueprintId: 68, printProviderId: 1, printifyProductId: "6a4da004d023be308b09aeee", imageStem: "21-production-incident", tags: ["oncall", "drinkware"] },
  { id: "security-posture-mug", title: "Security Posture", tagline: "How low can you go?", description: "Wrap: stick figure doing the limbo under a lowering bar.", kind: "mug", blueprintId: 68, printProviderId: 1, printifyProductId: "6a4da013fecfb263540f0da9", imageStem: "22-security-posture", tags: ["security", "drinkware"] },
  { id: "hiring-update-mug", title: "We're Like a Family Here", tagline: "This role has been eliminated.", description: "Exterior: the headline. Interior: This role has been eliminated.", kind: "mug", blueprintId: 68, printProviderId: 1, printifyProductId: "6a4da16fb9f554ed25015e3a", imageStem: "23-hiring-update", tags: ["work", "drinkware"] },
];

const STICKERS: ProductSeed[] = [
  { id: "other-car-cve-sticker", title: "My Other Car Has a CVE", tagline: "Runs on log4j and prayers.", description: "Sticker: the headline + tagline.", kind: "sticker", blueprintId: 384, printProviderId: 1, printifyProductId: "6a4da022d023be308b09aeff", imageStem: "24-other-car-cve", tags: ["security"] },
  { id: "debugging-career-sticker", title: "Debugging My Career in Production", tagline: "No staging. Straight to prod.", description: "Sticker: the headline + tagline.", kind: "sticker", blueprintId: 384, printProviderId: 1, printifyProductId: "6a4da03cfecfb263540f0db6", imageStem: "25-debugging-career", tags: ["dev", "work"] },
  { id: "oncall-rotation-sticker", title: "Don't Talk To Me Until My On-Call Rotation Ends", tagline: "Busy surviving.", description: "Sticker: the headline.", kind: "sticker", blueprintId: 384, printProviderId: 1, printifyProductId: "6a4da04aef9faaaa37023529", imageStem: "26-oncall-rotation", tags: ["oncall"] },
  { id: "kubernetes-mortgage-sticker", title: "My Other Car Is a Kubernetes Cluster", tagline: "Costs more than my mortgage.", description: "Sticker: the headline + tagline.", kind: "sticker", blueprintId: 384, printProviderId: 1, printifyProductId: "6a4da064fecfb263540f0dc4", imageStem: "27-kubernetes-mortgage", tags: ["cloud"] },
  { id: "rto-rtfm-sticker", title: "RTO / RTFM — They're the Same Picture", tagline: "Read the memo.", description: "Sticker: the headline.", kind: "sticker", blueprintId: 384, printProviderId: 1, printifyProductId: "6a4da07bbf0ea22e610f2a48", imageStem: "28-rto-rtfm", tags: ["work"] },
  { id: "zero-trust-intern-sticker", title: "Zero Trust Architecture, Infinite Trust in the Intern", tagline: "They have root. It's fine.", description: "Sticker: the headline.", kind: "sticker", blueprintId: 384, printProviderId: 1, printifyProductId: "6a4da090069947de98041b9a", imageStem: "29-zero-trust-intern", tags: ["security"] },
  { id: "org-knowledge-sticker", title: "This Laptop Contains Organizational Knowledge That Will Die With Me", tagline: "No docs. Only me.", description: "Sticker: the headline.", kind: "sticker", blueprintId: 384, printProviderId: 1, printifyProductId: "6a4da0a4fecfb263540f0de7", imageStem: "30-organizational-knowledge", tags: ["work"] },
  { id: "ai-survivor-kit-sticker", title: "AI Survivor Kit", tagline: "4-pack sticker set.", description: "4-up sticker sheet: 'My job is safe. The AI can't sit in meetings.' + 3 more.", kind: "sticker", blueprintId: 384, printProviderId: 1, printifyProductId: "6a4da0be9a0edbf1560d005b", imageStem: "31-ai-survivor-kit", tags: ["ai"] },
];

const POSTERS: ProductSeed[] = [
  { id: "5-stages-debugging-poster", title: "The 5 Stages of Debugging", tagline: "Denial → Acceptance: it was a typo.", description: "Poster: the 5 stages list.", kind: "poster", blueprintId: 554, printProviderId: 69, printifyProductId: "6a4da0d29a0edbf1560d0066", imageStem: "32-five-stages-debugging", tags: ["dev"] },
  { id: "5-stages-outage-poster", title: "The Five Stages of an Outage", tagline: "Denial: it's probably DNS → Acceptance: it was DNS.", description: "Poster: the 5 stages list.", kind: "poster", blueprintId: 554, printProviderId: 69, printifyProductId: "6a4da0e39a0edbf1560d0075", imageStem: "33-five-stages-outage", tags: ["oncall"] },
  { id: "cloud-journey-poster", title: "The Cloud Journey", tagline: "7-phase circular diagram.", description: "Poster: on-prem → cloud → hybrid → on-prem → ...", kind: "poster", blueprintId: 554, printProviderId: 69, printifyProductId: "6a4da0fa0e46eb97410dcde3", imageStem: "34-cloud-journey", tags: ["cloud"] },
];

/* ------------------------------------------------------------------ */
/* Build the catalog                                                  */
/* ------------------------------------------------------------------ */

const KIND_CATEGORY: Record<ProductKind, Product["category"]> = {
  tshirt: "apparel",
  hoodie: "apparel",
  mug: "drinkware",
  sticker: "accessories",
  poster: "wall",
};

const KIND_IMAGE_DIR: Record<ProductKind, string> = {
  tshirt: "tshirts",
  hoodie: "hoodies",
  mug: "mugs",
  sticker: "stickers",
  poster: "posters",
};

function buildProduct(seed: ProductSeed): Product {
  const dir = KIND_IMAGE_DIR[seed.kind];
  const imageFront = `/designs/png/${dir}/${seed.imageStem}-front.png`;
  const imageBack = seed.hasBack ? `/designs/png/${dir}/${seed.imageStem}-back.png` : undefined;

  let vs: ProductVariant[];
  let defaultVariantId: string;
  switch (seed.kind) {
    case "tshirt":
      vs = variants(TEE_SIZES);
      defaultVariantId = "l";
      break;
    case "hoodie":
      vs = variants(HOODIE_SIZES);
      defaultVariantId = "l";
      break;
    case "mug":
      vs = variants([MUG_VARIANT]);
      defaultVariantId = "11oz";
      break;
    case "sticker":
      vs = variants([STICKER_VARIANT]);
      defaultVariantId = "3x3";
      break;
    case "poster":
      vs = variants(POSTER_SIZES);
      defaultVariantId = "12x18";
      break;
  }

  return {
    id: seed.id,
    title: seed.title,
    tagline: seed.tagline,
    description: seed.description,
    category: KIND_CATEGORY[seed.kind],
    kind: seed.kind,
    blueprintId: seed.blueprintId,
    printProviderId: seed.printProviderId,
    printifyProductId: seed.printifyProductId,
    imageFront,
    imageBack,
    variants: vs,
    defaultVariantId,
    tags: seed.tags,
  };
}

export const PRODUCTS: Product[] = [
  ...TEES.map(buildProduct),
  ...HOODIES.map(buildProduct),
  ...MUGS.map(buildProduct),
  ...STICKERS.map(buildProduct),
  ...POSTERS.map(buildProduct),
];

export const CATALOG: Product[] = PRODUCTS;

/* ------------------------------------------------------------------ */
/* Category filters                                                   */
/* ------------------------------------------------------------------ */

export const CATEGORY_FILTERS: CategoryFilter[] = [
  { slug: "all", label: "All" },
  { slug: "apparel", label: "Apparel" },
  { slug: "drinkware", label: "Drinkware" },
  { slug: "accessories", label: "Accessories" },
  { slug: "wall", label: "Posters" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId);
}

export function productsByCategory(category: Product["category"] | "all"): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

/** Format integer cents as a USD string. */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
