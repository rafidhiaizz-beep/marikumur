import { useApp } from "../context/AppContext"
import { useIsMobile } from "../hooks/useIsMobile"

export default function Header({ page, setPage }) {
  const { cartCount, setCartOpen, isAdmin, darkMode, toggleDark } = useApp()
  const isMobile = useIsMobile()

  const navItems = [
    { key: "home",      label: "Beranda" },
    { key: "menu",      label: "Menu" },
    { key: "reservasi", label: "Reservasi" },
    { key: "status",    label: "Status" },
  ]

  return (
    <header style={{
      background: "rgba(18, 12, 6, 0.95)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      color: "#fff",
      padding: "0 20px",
      position: "sticky", top: 0, zIndex: 100,
      borderBottom: "1px solid rgba(245,158,11,0.12)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 58,
      }}>
        {/* Logo */}
        <button
          onClick={() => setPage("home")}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          style={{
            background: "none", border: "none", color: "#fff",
            fontSize: 17, fontFamily: "Georgia, serif",
            cursor: "pointer", letterSpacing: 2,
            display: "flex", alignItems: "center", gap: 8,
            transition: "opacity 0.2s",
          }}>
          <span style={{
            background: "linear-gradient(135deg, #f59e0b, #c8772a)",
            borderRadius: 8, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0,
          }}>🍽</span>
          <span>mari<span style={{ color: "#f59e0b" }}>kumur</span></span>
        </button>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {navItems.map(({ key, label }) => (
              <button key={key} onClick={() => setPage(key)} style={{
                background: page === key
                  ? "rgba(245,158,11,0.15)"
                  : "none",
                color: page === key ? "#f59e0b" : "rgba(255,255,255,0.55)",
                border: "none",
                borderBottom: page === key ? "2px solid #f59e0b" : "2px solid transparent",
                padding: "6px 16px", height: 58,
                cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif",
                transition: "all 0.2s", letterSpacing: 0.3,
              }}
              onMouseEnter={e => { if (page !== key) e.currentTarget.style.color = "#fff" }}
              onMouseLeave={e => { if (page !== key) e.currentTarget.style.color = "rgba(255,255,255,0.55)" }}
              >{label}</button>
            ))}

            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />

            {/* Dark mode */}
            <button onClick={toggleDark} title="Toggle dark mode" style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ccc", padding: "6px 10px",
              borderRadius: 8, cursor: "pointer", fontSize: 14,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >{darkMode ? "☀️" : "🌙"}</button>

            {/* Cart */}
            <button
              onClick={() => { setPage("menu"); setCartOpen(true) }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#1a1a1a", border: "none",
                padding: "7px 16px", borderRadius: 999,
                cursor: "pointer", fontSize: 13, fontWeight: "bold",
                display: "flex", alignItems: "center", gap: 6,
                transition: "opacity 0.2s",
                boxShadow: cartCount > 0 ? "0 0 12px rgba(245,158,11,0.4)" : "none",
              }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  background: "#1a1a1a", color: "#f59e0b",
                  borderRadius: "50%", width: 18, height: 18,
                  fontSize: 10, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: "bold",
                }}>{cartCount}</span>
              )}
              {cartCount === 0 && <span>Keranjang</span>}
            </button>

            {/* Admin */}
            <button
              onClick={() => setPage(isAdmin ? "admin" : "adminlogin")}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              style={{
                background: "none", color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px",
                borderRadius: 8, cursor: "pointer", fontSize: 11, letterSpacing: 0.5,
                transition: "border-color 0.2s",
              }}>Admin</button>
          </nav>
        )}

        {/* Mobile icons */}
        {isMobile && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={toggleDark} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "6px 8px", fontSize: 15, cursor: "pointer",
            }}>{darkMode ? "☀️" : "🌙"}</button>
            <button
              onClick={() => { setPage("menu"); setCartOpen(true) }}
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#1a1a1a", border: "none",
                padding: "7px 14px", borderRadius: 999,
                cursor: "pointer", fontSize: 13, fontWeight: "bold",
                display: "flex", alignItems: "center", gap: 5,
                boxShadow: cartCount > 0 ? "0 0 10px rgba(245,158,11,0.4)" : "none",
              }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  background: "#1a1a1a", color: "#f59e0b",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 9, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: "bold",
                }}>{cartCount}</span>
              )}
            </button>
            <button
              onClick={() => setPage(isAdmin ? "admin" : "adminlogin")}
              style={{
                background: "none", color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.1)", padding: "6px 10px",
                borderRadius: 8, cursor: "pointer", fontSize: 11,
              }}>Admin</button>
          </div>
        )}
      </div>
    </header>
  )
}
