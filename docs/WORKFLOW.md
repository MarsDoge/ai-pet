# Workflow

This project is built with AI-assisted development and a document-first process.

## Required flow
1. Update or create the relevant spec/plan in `docs/`.
2. Split work into GitHub Issues.
3. Implement code changes per Issue.
4. Run tests (`pnpm -r test`).
5. Update `docs/STATUS.md` with a brief summary.

## Issue hygiene
- One Issue per change whenever possible.
- Close Issues with a summary + test status.

## AI usage
- AI can be used for planning, breakdown, implementation, and review.
- Determinism and safety rules in `docs/CODEX_RULES.md` override everything.
