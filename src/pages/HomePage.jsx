import { useIsMobile } from "../hooks/useIsMobile"

export default function HomePage({ setPage }) {
  const isMobile = useIsMobile()

  const features = [
    { emoji: "🍳", title: "Menu Lengkap",      desc: "Berbagai pilihan masakan nusantara" },
    { emoji: "📅", title: "Reservasi Mudah",   desc: "Pesan meja untuk acara spesialmu" },
    { emoji: "🔍", title: "Lacak Pesanan",     desc: "Pantau status pesananmu real-time" },
  ]

  return (
    <div style={{ animation: "pageIn 0.25s ease" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: isMobile ? "28px 0 24px" : "48px 0 36px" }}>
        <div style={{ fontSize: isMobile ? 52 : 64, marginBottom: 10 }}>🍽</div>
        <h1 style={{
          fontSize: isMobile ? 32 : 46, fontWeight: "normal",
          margin: "0 0 10px", letterSpacing: 4, color: "var(--text)"
        }}>marikumur</h1>
        <p style={{ color: "var(--text-muted)", fontSize: isMobile ? 14 : 16, margin: "0 0 28px" }}>
          Pesan makanan &amp; reservasi meja dengan mudah
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("menu")} style={{
            background: "#1a1a1a", color: "#fff", border: "none",
            padding: isMobile ? "12px 26px" : "14px 36px",
            borderRadius: 999, fontSize: isMobile ? 14 : 15,
            cursor: "pointer", fontFamily: "Georgia, serif",
            transition: "opacity 0.2s",
          }}>Lihat Menu</button>
          <button onClick={() => setPage("reservasi")} style={{
            background: "none", color: "var(--text)",
            border: "2px solid var(--text)",
            padding: isMobile ? "12px 26px" : "14px 36px",
            borderRadius: 999, fontSize: isMobile ? 14 : 15,
            cursor: "pointer", fontFamily: "Georgia, serif",
          }}>Reservasi Meja</button>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
        gap: 12, marginTop: 8,
      }}>
        {features.map(({ emoji, title, desc }) => (
          <div key={title} style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "20px 18px",
            display: "flex", gap: isMobile ? 16 : 0,
            alignItems: isMobile ? "center" : "initial",
            flexDirection: isMobile ? "row" : "column",
            transition: "box-shadow 0.2s",
          }}>
            <div style={{ fontSize: 28, marginBottom: isMobile ? 0 : 10, flexShrink: 0 }}>{emoji}</div>
            <div style={{ textAlign: isMobile ? "left" : "center" }}>
              <div style={{ fontWeight: "bold", marginBottom: 4, fontSize: 14, color: "var(--text)" }}>{title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
