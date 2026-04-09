import { formatRupiah } from "../utils/helpers"
import { useApp } from "../context/AppContext"

export default function MenuCard({ item }) {
  const { cart, addToCart, removeFromCart } = useApp()
  const inCart = cart.find(i => i.id === item.id)

  return (
    <div style={{
      background: "var(--card-bg)", border: "1px solid var(--border)",
      borderRadius: 12, padding: 12,
      display: "flex", gap: 12, alignItems: "center",
      transition: "box-shadow 0.2s",
    }}>
      <img
        src={item.image} alt={item.name}
        style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 2, color: "var(--text)" }}>{item.name}</div>
        <div style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</div>
        <div style={{ color: "#c8772a", fontWeight: "bold", fontSize: 13 }}>{formatRupiah(item.price)}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
        {inCart ? (
          <>
            <button onClick={() => removeFromCart(item.id)} style={btnStyle("#fff", "var(--border)", "var(--text)")}>−</button>
            <span style={{ minWidth: 20, textAlign: "center", fontWeight: "bold", fontSize: 14, color: "var(--text)" }}>{inCart.qty}</span>
            <button onClick={() => addToCart(item)} style={btnStyle("#1a1a1a", "#1a1a1a", "#fff")}>+</button>
          </>
        ) : (
          <button onClick={() => addToCart(item)} style={{
            background: "#1a1a1a", color: "#fff", border: "none",
            padding: "6px 14px", borderRadius: 999,
            cursor: "pointer", fontSize: 13,
          }}>+</button>
        )}
      </div>
    </div>
  )
}

function btnStyle(bg, border, color) {
  return {
    width: 30, height: 30, borderRadius: "50%",
    border: `1px solid ${border}`, background: bg,
    color, cursor: "pointer", fontSize: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "opacity 0.15s",
  }
}
