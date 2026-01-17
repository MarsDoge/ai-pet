"use client";

type ProviderErrorBannerProps = {
  message?: string;
  onDismiss: () => void;
};

export function ProviderErrorBanner({ message, onDismiss }: ProviderErrorBannerProps) {
  if (!message) return null;
  return (
    <div
      className="panel"
      style={{
        borderColor: "rgba(240, 127, 95, 0.4)",
        background: "rgba(240, 127, 95, 0.1)",
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <span>
        <strong>AI 提示：</strong>{message}
      </span>
      <button className="action-button" type="button" onClick={onDismiss}>
        知道了
      </button>
    </div>
  );
}
