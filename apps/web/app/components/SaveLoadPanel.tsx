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
    setStatus("Export ready.");
  };

  const handleImport = () => {
    const result = onImport(payload);
    setStatus(result ?? "Import succeeded.");
  };

  return (
    <section className="panel">
      <h2 className="section-title">Save & Load</h2>
      <p className="subtle">Manual export/import uses JSON. Auto-save writes to localStorage.</p>
      <div className="save-grid" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="action-button" type="button" onClick={onSaveNow}>
            Save now
          </button>
          <button className="action-button" type="button" onClick={handleExport}>
            Export JSON
          </button>
          <button className="action-button" type="button" onClick={handleImport}>
            Import JSON
          </button>
        </div>
        <textarea
          value={payload}
          onChange={(event) => setPayload(event.target.value)}
          placeholder="Paste exported JSON here"
        />
        <div className="subtle">
          {status ? status : ""}
          {lastSavedAt ? ` Last saved: ${new Date(lastSavedAt).toLocaleTimeString()}.` : ""}
        </div>
      </div>
    </section>
  );
}
