import { useApp } from "../context/AppContext"
import { useIsMobile } from "../hooks/useIsMobile"

export default function Header({ page, setPage }) {
  const { cartCount, setCartOpen, isAdmin, darkMode, toggleDark } = useApp()
  const isMobile = useIsMobile()

  const navItems = [
    { key: "home", label: "Beranda" },
    { key: "menu", label: "Menu" },
    { key: "reservasi", label: "Reservasi" },
    { key: "status", label: "Status" },
  ]

  const bg = darkMode ? "#111" : "#1a1a1a"
  const textMuted = darkMode ? "#aaa" : "#ccc"

  return (
    <header style={{
      background: bg, color: "#fff",
      padding: "0 16px", position: "sticky", top: 0, zIndex: 100,
      borderBottom: darkMode ? "1px solid #222" : "none",
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 52,
      }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{
          background: "none", border: "none", color: "#fff",
          fontSize: 18, fontFamily: "Georgia, serif",
          cursor: "pointer", letterSpacing: 2,
        }}>
          🍽 marikumur
        </button>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {navItems.map(({ key, label }) => (
              <button key={key} onClick={() => setPage(key)} style={{
                background: page === key ? "#fff" : "none",
                color: page === key ? "#1a1a1a" : textMuted,
                border: "none", padding: "6px 14px", borderRadius: 999,
                cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif",
                transition: "all 0.2s",
              }}>{label}</button>
            ))}

            {/* Dark mode */}
            <button onClick={toggleDark} title="Toggle dark mode" style={{
              background: "none", border: "1px solid #444",
              color: "#ccc", padding: "5px 10px",
              borderRadius: 999, cursor: "pointer", fontSize: 13,
            }}>{darkMode ? "☀️" : "🌙"}</button>

            {/* Cart */}
            <button onClick={() => { setPage("menu"); setCartOpen(true) }} style={{
              background: "#f59e0b", color: "#1a1a1a", border: "none",
              padding: "6px 14px", borderRadius: 999,
              cursor: "pointer", fontSize: 13, fontWeight: "bold",
            }}>🛒 {cartCount}</button>

            {/* Admin */}
            <button onClick={() => setPage(isAdmin ? "admin" : "adminlogin")} style={{
              background: "none", color: "#888",
              border: "1px solid #444", padding: "5px 12px",
              borderRadius: 999, cursor: "pointer", fontSize: 12,
            }}>Admin</button>
          </nav>
        )}

        {/* Mobile icons */}
        {isMobile && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={toggleDark} style={{
              background: "none", border: "none", fontSize: 16, cursor: "pointer",
            }}>{darkMode ? "☀️" : "🌙"}</button>
            <button onClick={() => { setPage("menu"); setCartOpen(true) }} style={{
              background: "#f59e0b", color: "#1a1a1a", border: "none",
              padding: "6px 12px", borderRadius: 999,
              cursor: "pointer", fontSize: 13, fontWeight: "bold",
            }}>🛒 {cartCount}</button>
            <button onClick={() => setPage(isAdmin ? "admin" : "adminlogin")} style={{
              background: "none", color: "#888",
              border: "1px solid #444", padding: "5px 10px",
              borderRadius: 999, cursor: "pointer", fontSize: 11,
            }}>Admin</button>
          </div>
        )}
      </div>
    </header>
  )
}
