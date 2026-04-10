import { useApp } from "../context/AppContext"

const navItems = [
  { key: "home",      emoji: "🏠", label: "Beranda" },
  { key: "menu",      emoji: "🍽", label: "Menu" },
  { key: "reservasi", emoji: "📅", label: "Reservasi" },
  { key: "status",    emoji: "🔍", label: "Status" },
]

export default function BottomNav({ page, setPage }) {
  const { cartCount } = useApp()

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(15, 10, 5, 0.97)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      display: "flex", zIndex: 100,
      borderTop: "1px solid rgba(245,158,11,0.12)",
      boxShadow: "0 -8px 32px rgba(0,0,0,0.35)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {navItems.map(({ key, emoji, label }) => {
        const isActive = page === key
        const showBadge = key === "menu" && cartCount > 0
        return (
          <button
            key={key}
            onClick={() => setPage(key)}
            style={{
              flex: 1, background: "none", border: "none",
              color: isActive ? "#f59e0b" : "rgba(255,255,255,0.4)",
              padding: "10px 0 10px", cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3,
              transition: "color 0.2s",
              position: "relative",
            }}
          >
            {/* Active top glow line */}
            <div style={{
              position: "absolute",
              top: 0, left: "20%", right: "20%",
              height: 2,
              borderRadius: "0 0 2px 2px",
              background: isActive
                ? "linear-gradient(90deg, transparent, #f59e0b, transparent)"
                : "transparent",
              transition: "background 0.3s",
            }} />

            {/* Icon container */}
            <div style={{
              width: 40, height: 32,
              display: "flex", alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              background: isActive ? "rgba(245,158,11,0.12)" : "transparent",
              transition: "background 0.25s, transform 0.2s",
              transform: isActive ? "translateY(-2px)" : "translateY(0)",
              position: "relative",
            }}>
              <span style={{
                fontSize: isActive ? 22 : 19,
                transition: "font-size 0.2s",
                filter: isActive ? "drop-shadow(0 0 6px rgba(245,158,11,0.6))" : "none",
              }}>{emoji}</span>

              {/* Cart badge */}
              {showBadge && (
                <span style={{
                  position: "absolute", top: 2, right: 2,
                  background: "#f59e0b",
                  color: "#1a1a1a",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 9, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontWeight: "bold",
                  animation: "badge-pop 0.35s ease",
                  boxShadow: "0 2px 6px rgba(245,158,11,0.5)",
                }}>{cartCount}</span>
              )}
            </div>

            <span style={{
              fontSize: 9,
              letterSpacing: isActive ? 0.5 : 0,
              fontWeight: isActive ? "bold" : "normal",
              transition: "all 0.2s",
              textTransform: "uppercase",
            }}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
