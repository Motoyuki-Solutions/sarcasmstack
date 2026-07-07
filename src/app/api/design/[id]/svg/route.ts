export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

/**
 * Serves a design as a print-ready SVG.
 * In mock mode, returns a placeholder SVG.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const designId = params.id;
  const apiKey = process.env.PRINTIFY_API_KEY;

  // If we have a real API key, we could fetch the design image from Printify
  // and convert/serve it. For now, we return a mock SVG placeholder.
  if (apiKey) {
    try {
      // In a real implementation, fetch the design asset from Printify
      // and convert to SVG or serve the print-ready file directly.
      // const res = await fetch(`https://api.printify.com/v1/uploads/${designId}.json`, {
      //   headers: { Authorization: `Bearer ${apiKey}` },
      // });
    } catch {
      // Fall through to mock
    }
  }

  // Return a mock SVG placeholder for the design
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#1a1a2e" rx="8"/>
  <text x="200" y="180" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="#d946ef">
    SarcasmStack
  </text>
  <text x="200" y="220" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#a3a3a3">
    Design #${designId}
  </text>
  <text x="200" y="250" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#737373">
    Print-Ready SVG
  </text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
