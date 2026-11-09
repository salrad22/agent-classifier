/**
 * @agent-classifier/sdk
 *
 * Classifies git commit diffs into user-defined categories (frontend, backend,
 * database, security, …) using Cloudflare's Clef decision model
 * (`@cf/cloudflare/clef`).
 *
 * Design: one `noul` question per category so multiple categories can apply to
 * a single change, with independent probabilities per category. Clef returns a
 * probability for every question, giving a deterministic schema with
 * probabilistic answers.
 */

/** A category definition from the user's classify.json config. */
export interface Category {
  /** Stable id, used as the question id and in results, e.g. "frontend". */
  id: string;
  /** What counts as this category; becomes part of the question instructions. */
  description: string;
}

/** Per-category probabilities, keyed by category id. */
export type CategoryProbabilities = Record<string, number>;

/** Normalized classification result for a single diff/commit. */
export interface ClassificationResult {
  /** The category with the highest probability. */
  primary: string;
  /** Probability per category, in [0, 1]. */
  probabilities: CategoryProbabilities;
}

// TODO(phase 1): state assembly (diff -> structured JSON state with size guards)
// TODO(phase 1): schema generation (categories -> one noul question per category)
// TODO(phase 1): Worker client (POST state + questions, return probabilities)
