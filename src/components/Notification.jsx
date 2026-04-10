export default function Notification({ message }) {
  if (!message) return null

  // Deteksi tipe pesan
  const isError   = message.toLowerCase().includes("wajib") || message.toLowerCase().includes("tidak") || message.toLowerCase().includes("kosong")
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("masuk") || message.toLowerCase().includes("dibatalkan")

  const accent = isError ? "#ef4444" : isSuccess ? "#10b981" : "#f59e0b"
  const icon   = isError ? "⚠️" : isSuccess ? "✅" : "✦"

  return (
    <div style={{
      position: "fixed", top: 72, left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      animation: "floatUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
      pointerEvents: "none",
      maxWidth: "90vw",
    }}>
      <div style={{
        background: "rgba(18, 12, 6, 0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${accent}44`,
        borderRadius: 14,
        padding: "11px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${accent}22`,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {/* Left accent bar */}
        <div style={{
          width: 3, height: 28, borderRadius: 2,
          background: `linear-gradient(180deg, ${accent}, ${accent}66)`,
          flexShrink: 0,
        }} />

        <span style={{ fontSize: 14 }}>{icon}</span>

        <span style={{
          fontSize: 13,
          color: "#f0ece4",
          fontFamily: "Georgia, serif",
          maxWidth: "70vw",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {message}
        </span>
      </div>
    </div>
  )
}
