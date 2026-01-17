# AI Provider Setup

This project supports optional LLM providers via OpenAI-compatible APIs.

## Supported providers
- none (templates only)
- OpenAI
- DeepSeek
- Ollama (OpenAI-compatible mode)

## Required fields
- API Key (required for any provider other than `none`)
- Model (optional, defaults to `gpt-4o-mini`)
- Base URL (optional, for compatible endpoints)

## Behavior
- If provider is `none`, templates are always used.
- If API Key is missing, the app shows a warning and falls back to templates.
- Failed requests fall back to templates and surface a non-blocking banner.

## Examples
- OpenAI:
  - Provider: `openai`
  - API Key: `<your key>`
  - Base URL: (leave empty)
  - Model: `gpt-4o-mini`

- Ollama (local):
  - Provider: `ollama`
  - API Key: (any string, required by the client)
  - Base URL: `http://localhost:11434/v1`
  - Model: `llama3.1:8b`
