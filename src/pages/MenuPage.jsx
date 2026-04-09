import { useState } from "react"
import { useApp } from "../context/AppContext"
import { useIsMobile } from "../hooks/useIsMobile"
import { formatRupiah } from "../utils/helpers"
import MenuCard from "../components/MenuCard"
import { TABLES } from "../data/menuData"

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
    border: "1px solid var(--border)", borderRadius: 8,
    padding: "11px 14px", fontSize: 14, width: "100%",
    boxSizing: "border-box", background: "var(--input-bg)",
    color: "var(--text)", outline: "none",
  }

  return (
    <div style={{ animation: "pageIn 0.25s ease" }}>
      <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: "normal", marginBottom: 14, letterSpacing: 1, color: "var(--text)" }}>Menu Kami</h2>

      {/* Search */}
      <input
        placeholder="🔍  Cari menu..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inp, marginBottom: 12 }}
      />

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{
            background: activeCategory === c ? "#1a1a1a" : "var(--card-bg)",
            color: activeCategory === c ? "#fff" : "var(--text-muted)",
            border: "1px solid var(--border)", padding: "6px 14px",
            borderRadius: 999, cursor: "pointer", fontSize: 12,
            whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
          }}>{c}</button>
        ))}
      </div>

      {/* Menu grid */}
      {filteredMenu.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0", fontSize: 14 }}>
          Menu tidak ditemukan 😔
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
          gap: 10, marginBottom: 24,
        }}>
          {filteredMenu.map(item => <MenuCard key={item.id} item={item} />)}
        </div>
      )}

      {/* Mobile cart toggle button */}
      {cart.length > 0 && isMobile && (
        <button onClick={() => setCartOpen(!cartOpen)} style={{
          position: "fixed", bottom: 70, left: 16, right: 16,
          background: "#1a1a1a", color: "#fff", border: "none",
          padding: 14, borderRadius: 12, fontSize: 14, cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "Georgia, serif", zIndex: 90,
        }}>
          <span>🛒 {cartCount} item</span>
          <span style={{ color: "#f59e0b" }}>{formatRupiah(totalCart)} {cartOpen ? "▼" : "▲"}</span>
        </button>
      )}

      {/* Cart panel */}
      {cart.length > 0 && (!isMobile || cartOpen) && (
        <div style={isMobile ? {
          position: "fixed", bottom: 120, left: 0, right: 0,
          background: "var(--card-bg)", borderRadius: "16px 16px 0 0",
          padding: 20, zIndex: 89, maxHeight: "70vh", overflowY: "auto",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
        } : {
          background: "var(--card-bg)", border: "1px solid var(--border)",
          borderRadius: 12, padding: 20,
        }}>
          <h3 style={{ margin: "0 0 14px", fontWeight: "normal", fontSize: 16, color: "var(--text)" }}>🛒 Keranjang</h3>
          {cart.map(i => (
            <div key={i.id} style={{
              display: "flex", justifyContent: "space-between",
              padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text)"
            }}>
              <span>{i.name} × {i.qty}</span>
              <span style={{ color: "#c8772a" }}>{formatRupiah(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: "bold", fontSize: 14, color: "var(--text)" }}>
            <span>Total</span>
            <span style={{ color: "#c8772a" }}>{formatRupiah(totalCart)}</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            <input placeholder="Nama kamu *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} />
            <select value={form.table} onChange={e => setForm({ ...form, table: e.target.value })} style={{ ...inp }}>
              <option value="">Pilih nomor meja *</option>
              {TABLES.map(t => <option key={t} value={t}>Meja {t}</option>)}
            </select>
            <input placeholder="Catatan (opsional)" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={inp} />
            <button onClick={handleOrder} style={{
              background: "#1a1a1a", color: "#fff", border: "none",
              padding: "13px", borderRadius: 8, fontSize: 15,
              cursor: "pointer", fontFamily: "Georgia, serif", width: "100%",
            }}>Pesan Sekarang</button>
          </div>
        </div>
      )}
    </div>
  )
}
