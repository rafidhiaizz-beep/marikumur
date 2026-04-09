import { useState } from "react"
import { useApp } from "../context/AppContext"
import { useIsMobile } from "../hooks/useIsMobile"
import { formatRupiah, exportToCSV } from "../utils/helpers"
import { STATUS_COLOR } from "../data/menuData"

export default function AdminPage({ setPage }) {
  const {
    orders, updateOrderStatus, deleteOrder,
    reservations, deleteReservasi,
    menuData, addMenuItem, updateMenuItem, deleteMenuItem,
    logoutAdmin, showNotif, openConfirm,
  } = useApp()
  const isMobile = useIsMobile()
  const [view, setView] = useState("orders")
  const [editMenu, setEditMenu] = useState(null)
  const [menuForm, setMenuForm] = useState({ name: "", desc: "", price: "", category: "", image: "download.jpg" })

  // ── Confirm helpers ───────────────────────────────────────────────────────
  async function confirmDelete(title, message, onConfirm) {
    const ok = await openConfirm({ title, message })
    if (ok) onConfirm()
  }

  // ── Menu form handlers ────────────────────────────────────────────────────
  function openEditMenu(item) {
    setEditMenu(item)
    setMenuForm({ name: item.name, desc: item.desc, price: String(item.price), category: item.category, image: item.image })
  }

  function openNewMenu() {
    setEditMenu("new")
    setMenuForm({ name: "", desc: "", price: "", category: "", image: "download.jpg" })
  }

  function saveMenu() {
    if (!menuForm.name || !menuForm.price || !menuForm.category) {
      showNotif("Nama, harga, dan kategori wajib diisi!")
      return
    }
    if (editMenu === "new") {
      addMenuItem(menuForm)
      showNotif("Menu berhasil ditambahkan!")
    } else {
      updateMenuItem(editMenu.id, menuForm)
      showNotif("Menu berhasil diupdate!")
    }
    setEditMenu(null)
  }

  const tabBtn = (key, label) => (
    <button key={key} onClick={() => setView(key)} style={{
      background: view === key ? "#1a1a1a" : "var(--card-bg)",
      color: view === key ? "#fff" : "var(--text-muted)",
      border: "1px solid var(--border)", padding: "8px 18px",
      borderRadius: 999, cursor: "pointer", fontSize: 13,
      whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
    }}>{label}</button>
  )

  const inp = {
    border: "1px solid var(--border)", borderRadius: 8,
    padding: "10px 13px", fontSize: 13, width: "100%",
    boxSizing: "border-box", background: "var(--input-bg)",
    color: "var(--text)", outline: "none",
  }

  return (
    <div style={{ animation: "pageIn 0.25s ease" }}>
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: "normal", margin: 0, color: "var(--text)" }}>
          Dashboard Admin
        </h2>
        <button onClick={() => { logoutAdmin(); setPage("home") }} style={{
          background: "none", border: "1px solid var(--border)",
          color: "var(--text)", padding: "6px 14px",
          borderRadius: 999, cursor: "pointer", fontSize: 12,
        }}>Keluar</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {tabBtn("orders",    "Pesanan")}
        {tabBtn("menu",      "Kelola Menu")}
        {tabBtn("reservasi", "Reservasi")}
      </div>

      {/* ── ORDERS ── */}
      {view === "orders" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button onClick={() => { exportToCSV(orders); showNotif("CSV berhasil di-export!") }} style={{
              background: "none", border: "1px solid var(--border)",
              color: "var(--text)", padding: "7px 14px",
              borderRadius: 8, cursor: "pointer", fontSize: 12,
            }}>📥 Export CSV</button>
          </div>

          {orders.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Belum ada pesanan masuk.</p>
          )}

          {[...orders].reverse().map(o => (
            <div key={o.kode} style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: 12, padding: isMobile ? 12 : 16, marginBottom: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <span style={{ fontWeight: "bold", fontSize: 14, color: "var(--text)" }}>{o.name}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: 12 }}> — Meja {o.table} · {o.time}</span>
                </div>
                <span style={{
                  background: STATUS_COLOR[o.status] + "22",
                  color: STATUS_COLOR[o.status],
                  padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: "bold", flexShrink: 0,
                }}>{o.status}</span>
              </div>

              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                {o.items.map(i => `${i.name} ×${i.qty}`).join(", ")}
                {o.note && ` · 📝 ${o.note}`}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontWeight: "bold", color: "#c8772a", fontSize: 14 }}>{formatRupiah(o.total)}</span>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                  {["Diproses", "Siap", "Selesai", "Ditolak"].map(s => (
                    <button key={s} onClick={() => updateOrderStatus(o.kode, s)} style={{
                      background: o.status === s ? STATUS_COLOR[s] : "var(--card-bg)",
                      color: o.status === s ? "#fff" : "var(--text-muted)",
                      border: "1px solid var(--border)",
                      padding: "4px 10px", borderRadius: 999,
                      cursor: "pointer", fontSize: 11, transition: "all 0.2s",
                    }}>{s}</button>
                  ))}
                  <button
                    onClick={() => confirmDelete(
                      "Hapus Pesanan?",
                      `Pesanan ${o.kode} dari ${o.name} akan dihapus permanen.`,
                      () => { deleteOrder(o.kode); showNotif("Pesanan dihapus.") }
                    )}
                    style={{
                      background: "none", color: "#ef4444",
                      border: "1px solid #ef4444", padding: "4px 10px",
                      borderRadius: 999, cursor: "pointer", fontSize: 11,
                    }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MENU MANAGEMENT ── */}
      {view === "menu" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button onClick={openNewMenu} style={{
              background: "#1a1a1a", color: "#fff", border: "none",
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13,
            }}>+ Tambah Menu</button>
          </div>

          {/* Inline form for add/edit */}
          {editMenu && (
            <div style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: 12, padding: 16, marginBottom: 16,
              display: "grid", gap: 8, animation: "pageIn 0.2s ease",
            }}>
              <h3 style={{ margin: "0 0 4px", fontWeight: "normal", fontSize: 15, color: "var(--text)" }}>
                {editMenu === "new" ? "➕ Tambah Menu Baru" : "✏️ Edit Menu"}
              </h3>
              <input placeholder="Nama menu *" value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} style={inp} />
              <input placeholder="Deskripsi" value={menuForm.desc} onChange={e => setMenuForm({ ...menuForm, desc: e.target.value })} style={inp} />
              <input type="number" placeholder="Harga (Rp) *" value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} style={inp} />
              <input placeholder="Kategori * (mis: Nasi, Mie, Minuman)" value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} style={inp} />
              <input placeholder="Nama file gambar (mis: download.jpg)" value={menuForm.image} onChange={e => setMenuForm({ ...menuForm, image: e.target.value })} style={inp} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveMenu} style={{
                  background: "#1a1a1a", color: "#fff", border: "none",
                  padding: "10px", borderRadius: 8, cursor: "pointer", flex: 1, fontSize: 13,
                }}>Simpan</button>
                <button onClick={() => setEditMenu(null)} style={{
                  background: "none", color: "var(--text)",
                  border: "1px solid var(--border)", padding: "10px",
                  borderRadius: 8, cursor: "pointer", flex: 1, fontSize: 13,
                }}>Batal</button>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 10 }}>
            {menuData.map(item => (
              <div key={item.id} style={{
                background: "var(--card-bg)", border: "1px solid var(--border)",
                borderRadius: 10, padding: 12,
                display: "flex", gap: 10, alignItems: "center",
              }}>
                <img src={item.image} alt={item.name} style={{ width: 52, height: 52, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: "bold", fontSize: 13, color: "var(--text)" }}>{item.name}</div>
                  <div style={{ color: "#c8772a", fontSize: 12 }}>{formatRupiah(item.price)}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 11 }}>{item.category}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
                  <button onClick={() => openEditMenu(item)} style={{
                    background: "none", border: "1px solid var(--border)",
                    color: "var(--text)", padding: "4px 10px",
                    borderRadius: 6, cursor: "pointer", fontSize: 11,
                  }}>Edit</button>
                  <button
                    onClick={() => confirmDelete(
                      "Hapus Menu?",
                      `"${item.name}" akan dihapus dari daftar menu.`,
                      () => { deleteMenuItem(item.id); showNotif("Menu dihapus.") }
                    )}
                    style={{
                      background: "none", color: "#ef4444",
                      border: "1px solid #ef4444", padding: "4px 10px",
                      borderRadius: 6, cursor: "pointer", fontSize: 11,
                    }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESERVASI ── */}
      {view === "reservasi" && (
        <div>
          {reservations.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Belum ada reservasi.</p>
          )}
          {[...reservations].reverse().map(r => (
            <div key={r.kode} style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: 10, padding: 14, marginBottom: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: 14, color: "var(--text)" }}>{r.name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{r.date} · {r.time} · {r.guests} tamu</div>
                  {r.note && <div style={{ color: "var(--text-muted)", fontSize: 11 }}>📝 {r.note}</div>}
                  <div style={{ color: "#aaa", fontSize: 11, marginTop: 2 }}>Kode: {r.kode}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 10px", borderRadius: 999, fontSize: 11 }}>
                    {r.status}
                  </span>
                  <button
                    onClick={() => confirmDelete(
                      "Hapus Reservasi?",
                      `Reservasi ${r.kode} dari ${r.name} akan dihapus.`,
                      () => { deleteReservasi(r.kode); showNotif("Reservasi dihapus.") }
                    )}
                    style={{
                      background: "none", color: "#ef4444",
                      border: "1px solid #ef4444", padding: "4px 10px",
                      borderRadius: 999, cursor: "pointer", fontSize: 11,
                    }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
