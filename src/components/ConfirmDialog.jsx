import { useApp } from "../context/AppContext"

export default function ConfirmDialog() {
  const { confirmDialog, resolveConfirm } = useApp()
  if (!confirmDialog) return null

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9998, padding: 16, animation: "fadeIn 0.15s ease",
    }}>
      <div style={{
        background: "var(--card-bg)", borderRadius: 16,
        padding: 24, maxWidth: 320, width: "100%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        animation: "pageIn 0.2s ease",
      }}>
        <h3 style={{ margin: "0 0 8px", fontWeight: "normal", color: "var(--text)", fontSize: 16 }}>
          {confirmDialog.title ?? "Konfirmasi"}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 20px" }}>
          {confirmDialog.message}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => resolveConfirm(false)} style={{
            flex: 1, background: "var(--card-bg)", color: "var(--text)",
            border: "1px solid var(--border)", padding: "10px",
            borderRadius: 8, cursor: "pointer", fontSize: 13,
          }}>Batal</button>
          <button onClick={() => resolveConfirm(true)} style={{
            flex: 1, background: "#ef4444", color: "#fff",
            border: "none", padding: "10px", borderRadius: 8,
            cursor: "pointer", fontSize: 13,
          }}>Hapus</button>
        </div>
      </div>
    </div>
  )
}
