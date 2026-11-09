# agent-classifier

Open-source SDK + tooling that classifies coding-agent activity — starting with
**git commit diffs** — into user-defined categories (frontend, backend, database,
security, …) using Cloudflare's [Clef](https://developers.cloudflare.com/workers-ai/models/clef/)
decision model.

## Why Clef?

Clef is a *decision* model, not a text generator: you give it a state (a diff, a
log, an action record) and a typed schema of questions, and it returns a
**probability for every option of every question**. That gives us:

- **Deterministic interfaces** — the output shape is guaranteed by the schema, no
  prompt-parsing or hallucinated fields.
- **Probabilistic answers** — a commit can be 83% frontend *and* 21% backend, so
  changes that touch multiple aspects are classified honestly.
- **Cheap classification at scale** — $0.24/M input tokens, zero output-token
  cost, and zero data retention (your diffs are not stored or used for training).

## Architecture

```
┌──────────────────┐   state + question schema   ┌─────────────┐   Clef   ┌───────────────────────┐
│  CLI / git hook   │ ──────────────────────────► │  SDK (core)  │ ────────► │  Cloudflare Worker     │
│  classify commit  │ ◄──────── probabilities ─── │              │          │  @cf/cloudflare/clef   │
└──────────────────┘                             └─────────────┘          └───────────────────────┘
```

The SDK is the product; everything else is a thin adapter:

| Package | What it does |
| --- | --- |
| `@agent-classifier/sdk` | Builds structured state from a diff, generates one `noul` question per configured category, normalizes the returned probabilities. |
| `@agent-classifier/worker` | Thin Cloudflare Worker fronting the Clef model: keeps your API token server-side, caches by diff hash, returns answers. |
| `@agent-classifier/cli` | User surface: `classify commit`, `classify diff`, `classify init` (installs the git post-commit hook). |

Because classification happens at the git layer, it works with **any** coding
agent (OpenCode, Claude Code, Cursor, plain human commits) — no agent-specific
plugin required.

## Planned usage

```sh
classify commit HEAD            # classify the latest commit's diff
classify diff --range abc..def  # classify an arbitrary range
classify init                   # install the .git/hooks/post-commit hook
classify categories             # list configured categories
```

Categories are config-driven (one `noul` question per category, so multiple can
apply). Adding `database` or `security` is a config edit, not a code change:

```json
{
  "categories": {
    "frontend": "UI, markup, styles, client-side JS, components",
    "backend": "APIs, server logic, routing, business rules, services"
  }
}
```

## Roadmap

- [ ] **Phase 1** — SDK: state assembly + schema generation + Worker client; Worker endpoint; `classify commit` one-shot.
- [ ] **Phase 2** — `classify init` post-commit hook, thresholds, local JSONL results log.
- [ ] **Phase 3** — GitHub Action adapter (PR annotations), more categories, optional magnitude `score`.
- [ ] **Phase 4** — Live action classification via agent hooks/plugins, reusing the same SDK.

## Development

```sh
pnpm install
pnpm build
```

## License

[MIT](LICENSE)
