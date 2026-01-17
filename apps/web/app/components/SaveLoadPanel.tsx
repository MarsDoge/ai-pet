"use client";

import { useState } from "react";

type SaveLoadPanelProps = {
  onExport: () => string;
  onImport: (payload: string) => string | null;
  onSaveNow: () => void;
  lastSavedAt?: number;
};

export function SaveLoadPanel({ onExport, onImport, onSaveNow, lastSavedAt }: SaveLoadPanelProps) {
  const [payload, setPayload] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleExport = () => {
    const data = onExport();
    setPayload(data);
    setStatus("导出完成。");
  };

  const handleImport = () => {
    const result = onImport(payload);
    setStatus(result ?? "导入成功。");
  };

  return (
    <section className="panel">
      <h2 className="section-title">存档与读取</h2>
      <p className="subtle">手动导入/导出使用 JSON，自动存档写入本地存储。</p>
      <div className="save-grid" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="action-button" type="button" onClick={onSaveNow}>
            立即存档
          </button>
          <button className="action-button" type="button" onClick={handleExport}>
            导出 JSON
          </button>
          <button className="action-button" type="button" onClick={handleImport}>
            导入 JSON
          </button>
        </div>
        <textarea
          value={payload}
          onChange={(event) => setPayload(event.target.value)}
          placeholder="在此粘贴导出的 JSON"
        />
        <div className="subtle">
          {status ? status : ""}
          {lastSavedAt ? ` 上次存档：${new Date(lastSavedAt).toLocaleTimeString()}。` : ""}
        </div>
      </div>
    </section>
  );
}
