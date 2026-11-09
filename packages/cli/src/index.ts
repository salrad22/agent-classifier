#!/usr/bin/env node
/**
 * @agent-classifier/cli
 *
 * Planned commands:
 *   classify commit [REF]         classify a commit's diff (default HEAD)
 *   classify diff --range A..B    classify an arbitrary diff range
 *   classify init                 install the .git/hooks/post-commit hook
 *   classify categories           list configured categories
 *
 * Output: pretty table by default, JSON with --json. Classification failures
 * must never block a commit.
 */

// TODO(phase 1): argument parsing + `classify commit` one-shot
console.log("agent-classifier CLI — not implemented yet (phase 1)");
