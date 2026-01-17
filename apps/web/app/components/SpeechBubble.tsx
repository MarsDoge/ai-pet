export function SpeechBubble({ message }: { message: string }) {
  return (
    <div className="speech-bubble" style={{ top: 24, left: 24 }}>
      <strong style={{ fontSize: 14 }}>"{message}"</strong>
    </div>
  );
}
