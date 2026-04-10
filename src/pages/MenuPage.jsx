import { useState } from "react"
import { useApp } from "../context/AppContext"
import { useIsMobile } from "../hooks/useIsMobile"
import { formatRupiah } from "../utils/helpers"
import MenuCard from "../components/MenuCard"
import SectionDivider from "../components/SectionDivider"
import { TABLES } from "../data/menuData"

const CATEGORY_ICONS = {
  "Semua": "🍽",
  "Nasi":  "🍚",
  "Mie":   "🍜",
  "Ayam":  "🍗",
  "Sup":   "🥣",
  "Sayur": "🥗",
  "Minuman": "🥤",
  "Snack": "🍌",
}

export default function MenuPage({ setPage }) {
  const { menuData, cart, cartOpen, setCartOpen, totalCart, cartCount, showNotif, submitOrder } = useApp()
  const isMobile = useIsMobile()
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [search, setSearch] = useState("")
  const [form, setForm] = useState({ name: "", table: "", note: "" })

  const categories = ["Semua", ...new Set(menuData.map(m => m.category))]
  const filteredMenu = menuData.filter(m => {
    const matchCat = activeCategory === "Semua" || m.category === activeCategory
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function handleOrder() {
    if (!form.name || !form.table) { showNotif("Nama dan nomor meja wajib diisi!"); return }
    if (cart.length === 0) { showNotif("Keranjang masih kosong!"); return }
    const order = submitOrder(form)
    setForm({ name: "", table: "", note: "" })
    setCartOpen(false)
    showNotif(`Pesanan masuk! Kode: ${order.kode}`)
    setPage("status")
  }

  const inp = {
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
    background: "var(--input-bg)",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  }

  return (
    <div style={{ animation: "pageIn 0.28s ease" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontSize: isMobile ? 24 : 30,
          fontWeight: "normal",
          letterSpacing: 1.5,
          color: "var(--text)",
          margin: "0 0 4px",
        }}>
          Menu <span style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Kami</span>
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 12.5, margin: 0 }}>
          Pilih dari berbagai masakan nusantara otentik
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <span style={{
          position: "absolute", left: 14, top: "50%",
          transform: "translateY(-50%)",
          fontSize: 16, pointerEvents: "none",
          color: "var(--text-muted)",
        }}>🔍</span>
        <input
          placeholder="Cari menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inp, paddingLeft: 40 }}
        />
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            style={{
              background: activeCategory === c
                ? "linear-gradient(135deg, #1a1a1a, #2d1a0a)"
                : "var(--card-bg)",
              color: activeCategory === c ? "#f59e0b" : "var(--text-muted)",
              border: activeCategory === c
                ? "1px solid rgba(245,158,11,0.3)"
                : "1px solid var(--border)",
              padding: "7px 14px",
              borderRadius: 999,
              cursor: "pointer",
              fontSize: 12,
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 5,
              boxShadow: activeCategory === c ? "0 2px 12px rgba(245,158,11,0.15)" : "none",
            }}
          >
            <span>{CATEGORY_ICONS[c] || "🍽"}</span>
            {c}
          </button>
        ))}
      </div>

      {/* Result info */}
      {search && (
        <div style={{
          fontSize: 12, color: "var(--text-muted)",
          marginBottom: 10,
        }}>
          {filteredMenu.length} menu ditemukan untuk "<span style={{ color: "#f59e0b" }}>{search}</span>"
        </div>
      )}

      {/* Menu grid */}
      {filteredMenu.length === 0 ? (
        <div style={{
          textAlign: "center",
          color: "var(--text-muted)",
          padding: "60px 0",
          fontSize: 14,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>😔</div>
          <div>Menu tidak ditemukan</div>
          <button
            onClick={() => { setSearch(""); setActiveCategory("Semua") }}
            style={{
              marginTop: 12,
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >Reset filter</button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
          gap: 10,
          marginBottom: 24,
        }}>
          {filteredMenu.map(item => <MenuCard key={item.id} item={item} />)}
        </div>
      )}

      {/* Mobile cart toggle */}
      {cart.length > 0 && isMobile && (
        <button
          onClick={() => setCartOpen(!cartOpen)}
          style={{
            position: "fixed", bottom: 70, left: 16, right: 16,
            background: "linear-gradient(135deg, #1a1a1a, #2d1a0a)",
            color: "#fff", border: "1px solid rgba(245,158,11,0.3)",
            padding: "14px 18px", borderRadius: 14, fontSize: 14,
            cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontFamily: "Georgia, serif", zIndex: 90,
            boxShadow: "0 -4px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(245,158,11,0.1)",
          }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            🛒
            <span style={{
              background: "#f59e0b", color: "#1a1a1a",
              borderRadius: "50%", width: 18, height: 18,
              fontSize: 10, display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: "bold",
            }}>{cartCount}</span>
            <span>{cartCount} item</span>
          </span>
          <span style={{ color: "#f59e0b", display: "flex", alignItems: "center", gap: 6 }}>
            {formatRupiah(totalCart)}
            <span style={{ fontSize: 10 }}>{cartOpen ? "▼" : "▲"}</span>
          </span>
        </button>
      )}

      {/* Cart panel */}
      {cart.length > 0 && (!isMobile || cartOpen) && (
        <div style={isMobile ? {
          position: "fixed", bottom: 120, left: 0, right: 0,
          background: "var(--card-bg)",
          borderRadius: "20px 20px 0 0",
          padding: 20, zIndex: 89,
          maxHeight: "70vh", overflowY: "auto",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.2)",
          borderTop: "1px solid rgba(245,158,11,0.2)",
        } : {
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 24,
          marginTop: 8,
        }}>
          {/* Cart header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 14,
          }}>
            <span style={{ fontSize: 18 }}>🛒</span>
            <h3 style={{
              margin: 0, fontWeight: "normal",
              fontSize: 16, color: "var(--text)",
            }}>Keranjang Pesanan</h3>
            <span style={{
              marginLeft: "auto",
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#f59e0b",
              borderRadius: 999,
              padding: "2px 10px",
              fontSize: 11,
            }}>{cartCount} item</span>
          </div>

          {/* Cart items */}
          {cart.map(i => (
            <div key={i.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid var(--border)",
              fontSize: 13,
              color: "var(--text)",
            }}>
              <span>{i.name} <span style={{ color: "var(--text-muted)" }}>× {i.qty}</span></span>
              <span style={{ color: "#c8772a", fontWeight: "bold" }}>{formatRupiah(i.price * i.qty)}</span>
            </div>
          ))}

          {/* Total */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 12, paddingTop: 4,
            fontWeight: "bold", fontSize: 15, color: "var(--text)",
          }}>
            <span>Total</span>
            <span style={{ color: "#c8772a" }}>{formatRupiah(totalCart)}</span>
          </div>

          {/* Form */}
          <div style={{ marginTop: 16, display: "grid", gap: 9 }}>
            <input
              placeholder="Nama kamu *"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inp}
            />
            <select
              value={form.table}
              onChange={e => setForm({ ...form, table: e.target.value })}
              style={inp}
            >
              <option value="">Pilih nomor meja *</option>
              {TABLES.map(t => <option key={t} value={t}>Meja {t}</option>)}
            </select>
            <input
              placeholder="Catatan (opsional)"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              style={inp}
            />
            <button
              onClick={handleOrder}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,158,11,0.4)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(245,158,11,0.25)"
              }}
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#1a1a1a", border: "none",
                padding: "13px", borderRadius: 10, fontSize: 15,
                cursor: "pointer", fontFamily: "Georgia, serif",
                fontWeight: "bold", width: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 16px rgba(245,158,11,0.25)",
              }}>
              🍽 Pesan Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
