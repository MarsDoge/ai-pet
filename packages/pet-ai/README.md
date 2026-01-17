# pet-ai

Optional AI layer for AI Pet.

## Responsibilities
- Template fallback replies when no provider is configured.
- LLM adapter interface and compatible provider fetch.
- Structured reply shape (text/tags/suggestions only).

## Rules
- Must never mutate numeric state.
- All state changes remain in pet-core reducers.

## Public API
- `buildTemplateReply()`
- `createTemplateAdapter()`
- `fetchOpenAiCompatibleReply()`
- `AiReply`, `ContextSnapshot`

## Tests
No tests yet.
