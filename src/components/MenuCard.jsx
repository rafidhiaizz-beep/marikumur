import { formatRupiah } from "../utils/helpers"
import { useApp } from "../context/AppContext"
import { useState } from "react"

export default function MenuCard({ item }) {
  const { cart, addToCart, removeFromCart } = useApp()
  const inCart = cart.find(i => i.id === item.id)
  const [hovered, setHovered] = useState(false)
  const [addAnim, setAddAnim] = useState(false)

  function handleAdd() {
    addToCart(item)
    setAddAnim(true)
    setTimeout(() => setAddAnim(false), 400)
  }

  // Warna aksen per kategori
  const categoryColors = {
    "Nasi":    "#f59e0b",
    "Mie":     "#c8772a",
    "Ayam":    "#e57c23",
    "Sup":     "#10b981",
    "Sayur":   "#22c55e",
    "Minuman": "#3b82f6",
    "Snack":   "#a855f7",
  }
  const accent = categoryColors[item.category] || "#f59e0b"

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${hovered ? accent + "44" : "var(--border)"}`,
        borderRadius: 16,
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 12px 36px rgba(0,0,0,0.12), 0 0 0 1px ${accent}33`
          : "0 1px 4px rgba(0,0,0,0.04)",
        cursor: "default",
        position: "relative",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${accent}, ${accent}88, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: "opacity 0.25s",
      }} />

      <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px" }}>
        {/* Gambar / placeholder */}
        <div style={{
          width: 70, height: 70,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${accent}22, ${accent}10)`,
          border: `1.5px solid ${accent}33`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          overflow: "hidden",
          transition: "transform 0.25s",
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}>
          {item.image && item.image !== "download.jpg" ? (
            <img
              src={item.image} alt={item.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 11 }}
            />
          ) : (
            <span style={{ fontSize: 30 }}>
              {item.category === "Nasi" ? "🍚" :
               item.category === "Mie"  ? "🍜" :
               item.category === "Ayam" ? "🍗" :
               item.category === "Sup"  ? "🥣" :
               item.category === "Sayur"? "🥗" :
               item.category === "Minuman" ? "🥤" :
               item.category === "Snack" ? "🍌" : "🍽"}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badge kategori */}
          <div style={{
            display: "inline-block",
            fontSize: 9,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: accent,
            background: accent + "18",
            border: `1px solid ${accent}33`,
            borderRadius: 999,
            padding: "2px 8px",
            marginBottom: 4,
          }}>
            {item.category}
          </div>

          <div style={{
            fontWeight: "bold",
            fontSize: 14,
            color: "var(--text)",
            marginBottom: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {item.name}
          </div>

          <div style={{
            color: "var(--text-muted)",
            fontSize: 11,
            marginBottom: 6,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.4,
          }}>
            {item.desc}
          </div>

          <div style={{
            color: accent,
            fontWeight: "bold",
            fontSize: 14,
            fontFamily: "Georgia, serif",
          }}>
            {formatRupiah(item.price)}
          </div>
        </div>

        {/* Cart controls */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}>
          {inCart ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "3px 6px",
            }}>
              <button
                onClick={() => removeFromCart(item.id)}
                style={ctrlBtn("var(--card-bg)", "var(--border)", "var(--text)")}
              >−</button>
              <span style={{
                minWidth: 22,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 13,
                color: "var(--text)",
              }}>
                {inCart.qty}
              </span>
              <button
                onClick={handleAdd}
                style={ctrlBtn(accent, "transparent", "#1a1a1a")}
              >+</button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              style={{
                background: addAnim
                  ? `linear-gradient(135deg, #10b981, #059669)`
                  : `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                color: "#1a1a1a",
                border: "none",
                padding: "7px 14px",
                borderRadius: 999,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: "bold",
                transition: "all 0.2s",
                transform: addAnim ? "scale(0.92)" : "scale(1)",
                boxShadow: `0 3px 12px ${accent}44`,
              }}
            >
              {addAnim ? "✓" : "+ Tambah"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ctrlBtn(bg, border, color) {
  return {
    width: 28, height: 28,
    borderRadius: "50%",
    border: `1px solid ${border}`,
    background: bg,
    color,
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
    lineHeight: 1,
  }
}
