/**
 * @agent-classifier/worker
 *
 * Thin passthrough in front of Cloudflare's Clef decision model:
 *   POST /classify  { state, questions }  ->  { answers, usage }
 *
 * The Worker exists to (1) keep the Cloudflare account token server-side,
 * (2) cache answers by state hash so identical diffs are not re-billed, and
 * (3) rate-limit / auth callers with a simple bearer token.
 *
 * Schema logic intentionally lives in the SDK so the model can be swapped
 * (clef <-> clef-flash) without touching client code.
 */

export interface Env {
  /** Workers AI binding, configured in wrangler.jsonc. */
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // TODO(phase 1): bearer-token check
    // TODO(phase 1): POST /classify -> env.AI.run("@cf/cloudflare/clef", ...)
    // TODO(phase 1): cache answers by state hash (KV or Cache API)
    return new Response(
      JSON.stringify({ error: "not implemented yet" }),
      { status: 501, headers: { "content-type": "application/json" } },
    );
  },
} satisfies ExportableHandler<Env>;
