export const runtime = "nodejs";

// Apple y envoie les erreurs rencontrées par Wallet avec notre service.
// On les copie simplement dans les journaux Vercel pour pouvoir diagnostiquer.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    logs?: unknown;
  } | null;
  if (Array.isArray(body?.logs)) {
    for (const entry of body.logs.slice(0, 20)) {
      console.warn("Apple Wallet log:", String(entry).slice(0, 500));
    }
  }
  return new Response(null, { status: 200 });
}
