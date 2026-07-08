export interface Product {
  id: string; name: string; description: string; price: number;
  category: "tshirt" | "hoodie" | "mug" | "sticker" | "poster";
  printifyId: string; image: string; tags: string[];
}
export const products: Product[] = [
  { id: "tee-trained-replacement", name: "I Trained My Replacement", description: "All I Got Was This Lousy Severance", price: 2999, category: "tshirt", printifyId: "6a4d9d909a0edbf1560cfe93", image: "/designs/png/tshirts/01-trained-replacement-front.png", tags: ["ai","bestseller"] },
  { id: "tee-async-update", name: "Async Update", description: "This Could Have Been an Asynchronous Update", price: 2999, category: "tshirt", printifyId: "6a4d9db53ac83974f90d0410", image: "/designs/png/tshirts/02-async-update-front.png", tags: ["meetings"] },
  { id: "tee-mute-button-hero", name: "Mute Button Hero", description: "I've been on mute for 3 years", price: 2999, category: "tshirt", printifyId: "6a4d9de221aceaf34e088e76", image: "/designs/png/tshirts/03-mute-button-hero-front.png", tags: ["meetings"] },
  { id: "tee-cve-therapy", name: "CVE Therapy", description: "Found in Production, Fixed in Therapy", price: 2999, category: "tshirt", printifyId: "6a4d9e00d023be308b09adc1", image: "/designs/png/tshirts/04-cve-therapy-front.png", tags: ["security"] },
  { id: "tee-cloud-bill", name: "Cloud Bill", description: "My Cloud Bill Has More Digits Than My Salary", price: 2999, category: "tshirt", printifyId: "6a4d9e1bef9faaaa370233d9", image: "/designs/png/tshirts/05-cloud-bill-front.png", tags: ["cloud"] },
  { id: "tee-my-kubernetes", name: "My Kubernetes", description: "It Works on My Kubernetes", price: 2999, category: "tshirt", printifyId: "6a4d9e3b9a0edbf1560cfede", image: "/designs/png/tshirts/06-my-kubernetes-front.png", tags: ["cloud"] },
  { id: "tee-printf-debugger", name: "printf Debugger", description: "I know there are better tools. I don't care.", price: 2999, category: "tshirt", printifyId: "6a4d9e5efecfb263540f0c94", image: "/designs/png/tshirts/07-printf-debugger-front.png", tags: ["debugging"] },
  { id: "tee-ai-attended", name: "AI Attended Meeting", description: "The AI Attended the Meeting So I Didn't Have To", price: 2999, category: "tshirt", printifyId: "6a4d9e7e069947de98041a89", image: "/designs/png/tshirts/08-ai-attended-meeting-front.png", tags: ["ai"] },
  { id: "tee-ai-took-job", name: "AI Took My Job", description: "Just kidding, it hallucinated the Exchange migration", price: 2999, category: "tshirt", printifyId: "6a4d9ea4347b30b396039458", image: "/designs/png/tshirts/09-ai-took-my-job-front.png", tags: ["ai","bestseller"] },
  { id: "tee-oncall-chic", name: "On-Call Chic", description: "ON-CALL CHIC — ALWAYS", price: 2999, category: "tshirt", printifyId: "6a4d9ec2bf0ea22e610f2949", image: "/designs/png/tshirts/10-oncall-chic-front.png", tags: ["oncall","bestseller"] },
  { id: "tee-meeting-venn", name: "Meeting Venn", description: "Meetings I've Attended vs Meetings That Needed to Happen", price: 2999, category: "tshirt", printifyId: "6a4d9ee69a0edbf1560cff6a", image: "/designs/png/tshirts/11-meeting-venn-front.png", tags: ["meetings"] },
  { id: "tee-patch-tuesday", name: "Patch Tuesday", description: "I deployed the patches. I survived. My print spooler did not.", price: 2999, category: "tshirt", printifyId: "6a4d9f0b21aceaf34e088f3c", image: "/designs/png/tshirts/12-patch-tuesday-front.png", tags: ["security"] },
  { id: "tee-cloud-costs", name: "Cloud Costs", description: "The cloud is just someone else's computer", price: 2999, category: "tshirt", printifyId: "6a4d9f2abf0ea22e610f29bd", image: "/designs/png/tshirts/13-someone-elses-computer-front.png", tags: ["cloud"] },
  { id: "hoodie-human-loop", name: "Human in the Loop", description: "I'm the human who gets paged at 3am when the loop breaks", price: 4499, category: "hoodie", printifyId: "6a4d9f8a21aceaf34e088f6c", image: "/designs/png/hoodies/14-human-in-loop-front.png", tags: ["ai"] },
  { id: "hoodie-senior-sysadmin", name: "Senior Sysadmin", description: "I don't know how it works either", price: 4499, category: "hoodie", printifyId: "6a4d9fa30e46eb97410dcd54", image: "/designs/png/hoodies/15-senior-sysadmin-front.png", tags: ["sysadmin"] },
  { id: "hoodie-business-continuity", name: "Business Continuity", description: "MY BACKUP STRATEGY: 1. Hope 2. Blame the intern", price: 4499, category: "hoodie", printifyId: "6a4d9fc1ac9d726eeb0eb8e2", image: "/designs/png/hoodies/16-business-continuity-front.png", tags: ["devops"] },
  { id: "mug-ai-do-it", name: "Sure, Let the AI Do It", description: "Interior: production outage screenshot", price: 1499, category: "mug", printifyId: "6a4da14e347b30b396039686", image: "/designs/png/mugs/17-let-ai-do-it-exterior.png", tags: ["ai"] },
  { id: "mug-circle-back", name: "Let's Circle Back", description: "Interior: You won. Your prize is another meeting.", price: 1499, category: "mug", printifyId: "6a4da15d0e46eb97410dcec2", image: "/designs/png/mugs/18-circle-back-exterior.png", tags: ["meetings"] },
  { id: "mug-zero-trust", name: "Zero Trust, Zero Sleep", description: "Alert fatigue is a myth, right?", price: 1499, category: "mug", printifyId: "6a4d9fdbef9faaaa370234ff", image: "/designs/png/mugs/19-zero-trust-zero-sleep.png", tags: ["security"] },
  { id: "mug-read-error", name: "Read the Error", description: "Line 142. The answer is always line 142.", price: 1499, category: "mug", printifyId: "6a4d9ff0fecfb263540f0da0", image: "/designs/png/mugs/20-read-the-error.png", tags: ["debugging"] },
  { id: "mug-prod-incident", name: "Production Incident", description: "This is my production incident mug", price: 1499, category: "mug", printifyId: "6a4da004d023be308b09aeee", image: "/designs/png/mugs/21-production-incident.png", tags: ["oncall"] },
  { id: "mug-security-posture", name: "Security Posture", description: "Stick figure doing the limbo under compliance minimum", price: 1499, category: "mug", printifyId: "6a4da013fecfb263540f0da9", image: "/designs/png/mugs/22-security-posture.png", tags: ["security"] },
  { id: "mug-hiring-update", name: "Hiring Update", description: "We're like a family here. Interior: This role has been eliminated.", price: 1499, category: "mug", printifyId: "6a4da16fb9f554ed25015e3a", image: "/designs/png/mugs/23-hiring-update-exterior.png", tags: ["layoffs"] },
  { id: "sticker-cve-car", name: "My Other Car Has a CVE", description: "This vehicle runs on log4j and prayers", price: 399, category: "sticker", printifyId: "6a4da022d023be308b09aeff", image: "/designs/png/stickers/24-other-car-cve.png", tags: ["security"] },
  { id: "sticker-debug-career", name: "Debugging My Career", description: "No staging environment. Straight to prod.", price: 399, category: "sticker", printifyId: "6a4da03cfecfb263540f0db6", image: "/designs/png/stickers/25-debugging-career.png", tags: ["debugging"] },
  { id: "sticker-oncall", name: "On-Call Rotation", description: "Don't Talk To Me Until My On-Call Rotation Ends", price: 399, category: "sticker", printifyId: "6a4da04aef9faaaa37023529", image: "/designs/png/stickers/26-oncall-rotation.png", tags: ["oncall"] },
  { id: "sticker-k8s-mortgage", name: "K8s Mortgage", description: "My Other Car Is A Kubernetes Cluster That Costs More Than My Mortgage", price: 399, category: "sticker", printifyId: "6a4da064fecfb263540f0dc4", image: "/designs/png/stickers/27-kubernetes-mortgage.png", tags: ["cloud"] },
  { id: "sticker-rto-rtfm", name: "RTO / RTFM", description: "They're The Same Picture", price: 399, category: "sticker", printifyId: "6a4da07bbf0ea22e610f2a48", image: "/designs/png/stickers/28-rto-rtfm.png", tags: ["layoffs"] },
  { id: "sticker-zero-trust-intern", name: "Zero Trust Intern", description: "Zero Trust Architecture, Infinite Trust In The Intern", price: 399, category: "sticker", printifyId: "6a4da090069947de98041b9a", image: "/designs/png/stickers/29-zero-trust-intern.png", tags: ["security"] },
  { id: "sticker-org-knowledge", name: "Org Knowledge", description: "This Laptop Contains Organizational Knowledge That Will Die With Me", price: 399, category: "sticker", printifyId: "6a4da0a4fecfb263540f0de7", image: "/designs/png/stickers/30-organizational-knowledge.png", tags: ["sysadmin"] },
  { id: "sticker-ai-survivor", name: "AI Survivor Kit", description: "My job is safe. The AI can't sit in meetings.", price: 399, category: "sticker", printifyId: "6a4da0be9a0edbf1560d005b", image: "/designs/png/stickers/31-ai-survivor-kit.png", tags: ["ai"] },
  { id: "poster-5-stages-debug", name: "5 Stages of Debugging", description: "It was a typo.", price: 1999, category: "poster", printifyId: "6a4da0d29a0edbf1560d0066", image: "/designs/png/posters/32-five-stages-debugging.png", tags: ["debugging","bestseller"] },
  { id: "poster-5-stages-outage", name: "5 Stages of an Outage", description: "It was DNS.", price: 1999, category: "poster", printifyId: "6a4da0e39a0edbf1560d0075", image: "/designs/png/posters/33-five-stages-outage.png", tags: ["debugging"] },
  { id: "poster-cloud-journey", name: "The Cloud Journey", description: "On-prem expensive to cloud expensive to hybrid expensive", price: 1999, category: "poster", printifyId: "6a4da0fa0e46eb97410dcde3", image: "/designs/png/posters/34-cloud-journey.png", tags: ["cloud"] },
];
export const categories = [
  { id: "all", name: "All Products" },
  { id: "tshirt", name: "T-Shirts" },
  { id: "hoodie", name: "Hoodies" },
  { id: "mug", name: "Mugs" },
  { id: "sticker", name: "Stickers" },
  { id: "poster", name: "Posters" },
] as const;
export function formatPrice(cents: number): string { return "$" + (cents / 100).toFixed(2); }
export function getProduct(id: string): Product | undefined { return products.find((p) => p.id === id); }
