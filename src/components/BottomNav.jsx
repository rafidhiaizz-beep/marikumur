export default function BottomNav({ page, setPage }) {
  const navItems = [
    { key: "home",      emoji: "🏠", label: "Beranda" },
    { key: "menu",      emoji: "🍽", label: "Menu" },
    { key: "reservasi", emoji: "📅", label: "Reservasi" },
    { key: "status",    emoji: "🔍", label: "Status" },
  ]

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#1a1a1a", display: "flex", zIndex: 100,
      borderTop: "1px solid #333",
    }}>
      {navItems.map(({ key, emoji, label }) => (
        <button key={key} onClick={() => setPage(key)} style={{
          flex: 1, background: "none", border: "none",
          color: page === key ? "#f59e0b" : "#888",
          padding: "10px 0 8px", cursor: "pointer",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 2,
          transition: "color 0.2s",
        }}>
          <span style={{ fontSize: 18 }}>{emoji}</span>
          <span style={{ fontSize: 10 }}>{label}</span>
        </button>
      ))}
    </nav>
  )
}
