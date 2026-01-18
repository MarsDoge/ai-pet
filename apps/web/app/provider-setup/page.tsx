export default function ProviderSetupPage() {
  return (
    <main>
      <header className="fade-in">
        <span className="badge">AI 配置</span>
        <h1 style={{ marginTop: 12, fontSize: "clamp(24px, 4vw, 36px)" }}>
          Provider 配置说明
        </h1>
        <p className="subtle">使用 OpenAI 兼容接口即可接入。</p>
      </header>

      <section className="panel" style={{ maxWidth: 760 }}>
        <h2 className="section-title">支持的 Provider</h2>
        <p className="subtle">OpenAI / DeepSeek / Ollama（兼容模式）</p>

        <h2 className="section-title" style={{ marginTop: 16 }}>
          必填与可选字段
        </h2>
        <ul>
          <li>API Key（除 none 外必填）</li>
          <li>Model（可选，默认 gpt-4o-mini）</li>
          <li>Base URL（可选，兼容端点）</li>
        </ul>

        <h2 className="section-title" style={{ marginTop: 16 }}>
          示例
        </h2>
        <p className="subtle">OpenAI:</p>
        <pre>
          Provider: openai
          API Key: YOUR_KEY
          Base URL: (留空)
          Model: gpt-4o-mini
        </pre>
        <p className="subtle">Ollama（本地）:</p>
        <pre>
          Provider: ollama
          API Key: any
          Base URL: http://localhost:11434/v1
          Model: llama3.1:8b
        </pre>
      </section>
    </main>
  );
}
