/**
 * SectionDivider — ornamen pemisah seksi bergaya nusantara premium
 * Props:
 *   label   : string (opsional)
 *   icon    : string emoji (opsional, default ✦)
 *   style   : object (override container)
 *   variant : "default" | "bold" | "subtle"
 */
export default function SectionDivider({ label, icon = "✦", style = {}, variant = "default" }) {
  const isBold   = variant === "bold"
  const isSubtle = variant === "subtle"

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      margin: isBold ? "12px 0 28px" : "8px 0 22px",
      ...style,
    }}>
      {/* Kiri ornamen */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 5 }}>
        {isBold && (
          <span style={{ color: "rgba(245,158,11,0.25)", fontSize: 8 }}>✦</span>
        )}
        <div style={{
          flex: 1,
          height: isBold ? 1.5 : 1,
          background: isSubtle
            ? "linear-gradient(90deg, transparent, rgba(245,158,11,0.15))"
            : "linear-gradient(90deg, transparent, rgba(245,158,11,0.4))",
          borderRadius: 1,
        }} />
        <span style={{
          color: isSubtle ? "rgba(245,158,11,0.3)" : "rgba(245,158,11,0.5)",
          fontSize: 9,
        }}>{icon}</span>
      </div>

      {/* Label tengah */}
      {label && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: isBold ? "4px 12px" : "0",
          background: isBold ? "rgba(245,158,11,0.06)" : "transparent",
          border: isBold ? "1px solid rgba(245,158,11,0.15)" : "none",
          borderRadius: isBold ? 999 : 0,
        }}>
          <span style={{
            fontSize: isSubtle ? 9 : 10,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: isSubtle
              ? "rgba(245,158,11,0.45)"
              : "rgba(245,158,11,0.75)",
            whiteSpace: "nowrap",
            fontFamily: "Georgia, serif",
          }}>
            {label}
          </span>
        </div>
      )}

      {/* Kanan ornamen */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{
          color: isSubtle ? "rgba(245,158,11,0.3)" : "rgba(245,158,11,0.5)",
          fontSize: 9,
        }}>{icon}</span>
        <div style={{
          flex: 1,
          height: isBold ? 1.5 : 1,
          background: isSubtle
            ? "linear-gradient(90deg, rgba(245,158,11,0.15), transparent)"
            : "linear-gradient(90deg, rgba(245,158,11,0.4), transparent)",
          borderRadius: 1,
        }} />
        {isBold && (
          <span style={{ color: "rgba(245,158,11,0.25)", fontSize: 8 }}>✦</span>
        )}
      </div>
    </div>
  )
}
