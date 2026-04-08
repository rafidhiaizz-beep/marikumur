import { useState } from "react"

const menuData = [
  { id: 1, name: "Nasi Goreng Spesial", desc: "Nasi goreng dengan telur, ayam, dan kerupuk", price: 25000, category: "Nasi", image: "download.jpg" },
  { id: 2, name: "Mie Ayam Bakso", desc: "Mie ayam dengan bakso sapi dan pangsit goreng", price: 22000, category: "Mie", image: "download.jpg" },
  { id: 3, name: "Ayam Bakar", desc: "Ayam bakar bumbu kecap dengan lalapan segar", price: 32000, category: "Ayam", emoji: "🍗" },
  { id: 4, name: "Soto Ayam", desc: "Soto kuning dengan suwiran ayam dan lontong", price: 20000, category: "Sup", emoji: "🥣" },
  { id: 5, name: "Gado-gado", desc: "Sayuran segar dengan bumbu kacang spesial", price: 18000, category: "Sayur", emoji: "🥗" },
  { id: 6, name: "Es Teh Manis", desc: "Teh manis segar dengan es batu", price: 5000, category: "Minuman", emoji: "🧋" },
  { id: 7, name: "Es Jeruk", desc: "Jeruk peras segar dengan es batu", price: 8000, category: "Minuman", emoji: "🍊" },
  { id: 8, name: "Pisang Goreng", desc: "Pisang goreng crispy dengan coklat meses", price: 12000, category: "Snack", emoji: "🍌" },
]

const tables = [1,2,3,4,5,6,7,8]

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID")
}

function generateKode() {
  return "MK" + Date.now().toString().slice(-5)
}

export default function App() {
  const [page, setPage] = useState("home")
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [adminOrders, setAdminOrders] = useState([])
  const [form, setForm] = useState({ name: "", table: "", note: "", date: "", time: "", guests: "" })
  const [reservations, setReservations] = useState([])
  const [adminView, setAdminView] = useState("orders")
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPass, setAdminPass] = useState("")
  const [searchKode, setSearchKode] = useState("")
  const [foundOrder, setFoundOrder] = useState(null)
  const [notification, setNotification] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")

  const categories = ["Semua", ...new Set(menuData.map(m => m.category))]
  const filteredMenu = activeCategory === "Semua" ? menuData : menuData.filter(m => m.category === activeCategory)

  const totalCart = cart.reduce((s, i) => s + i.price * i.qty, 0)

  function showNotif(msg) {
    setNotification(msg)
    setTimeout(() => setNotification(""), 2500)
  }

  function addToCart(item) {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id)
      if (ex) return prev.map(i => i.id === item.id ? {...i, qty: i.qty+1} : i)
      return [...prev, {...item, qty: 1}]
    })
    showNotif(item.name + " ditambahkan ke keranjang")
  }

  function removeFromCart(id) {
    setCart(prev => {
      const ex = prev.find(i => i.id === id)
      if (ex && ex.qty > 1) return prev.map(i => i.id === id ? {...i, qty: i.qty-1} : i)
      return prev.filter(i => i.id !== id)
    })
  }

  function submitOrder() {
    if (!form.name || !form.table) { showNotif("Nama dan nomor meja wajib diisi!"); return }
    if (cart.length === 0) { showNotif("Keranjang masih kosong!"); return }
    const kode = generateKode()
    const order = {
      kode, name: form.name, table: form.table, note: form.note,
      items: [...cart], total: totalCart,
      status: "Menunggu", time: new Date().toLocaleTimeString("id-ID", {hour:"2-digit",minute:"2-digit"})
    }
    setOrders(prev => [...prev, order])
    setAdminOrders(prev => [...prev, order])
    setCart([])
    setForm({ name: "", table: "", note: "", date: "", time: "", guests: "" })
    showNotif("Pesanan masuk! Kode kamu: " + kode)
    setPage("status")
    setSearchKode(kode)
    setFoundOrder(order)
  }

  function submitReservasi() {
    if (!form.name || !form.date || !form.time || !form.guests) { showNotif("Semua field wajib diisi!"); return }
    const kode = "RV" + Date.now().toString().slice(-5)
    const rsv = { kode, name: form.name, date: form.date, time: form.time, guests: form.guests, note: form.note, status: "Terkonfirmasi" }
    setReservations(prev => [...prev, rsv])
    setForm({ name: "", table: "", note: "", date: "", time: "", guests: "" })
    showNotif("Reservasi berhasil! Kode: " + kode)
  }

  function updateStatus(kode, status) {
    const update = arr => arr.map(o => o.kode === kode ? {...o, status} : o)
    setAdminOrders(update)
    setOrders(update)
    if (foundOrder?.kode === kode) setFoundOrder(fo => ({...fo, status}))
  }

  function cariOrder() {
    const found = orders.find(o => o.kode === searchKode.toUpperCase())
    setFoundOrder(found || null)
    if (!found) showNotif("Kode pesanan tidak ditemukan")
  }

  function loginAdmin() {
    if (adminPass === "admin123") { setIsAdmin(true); setPage("admin") }
    else showNotif("Password salah!")
  }

  const statusColor = {
    "Menunggu": "#f59e0b",
    "Diproses": "#3b82f6",
    "Siap": "#10b981",
    "Selesai": "#6b7280",
    "Ditolak": "#ef4444"
  }

  const cartCount = cart.reduce((s,i) => s+i.qty, 0)

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6", fontFamily: "'Georgia', serif", color: "#1a1a1a" }}>

      {/* Notifikasi */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "#1a1a1a", color: "#fff", padding: "10px 24px",
          borderRadius: 999, fontSize: 14, zIndex: 9999, whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
        }}>{notification}</div>
      )}

      {/* Header */}
      <header style={{ background: "#1a1a1a", color: "#fff", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, fontFamily: "Georgia, serif", cursor: "pointer", letterSpacing: 2 }}>
            🍽 marikumur
          </button>
          <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {["home","menu","reservasi","status"].map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                background: page === p ? "#fff" : "none",
                color: page === p ? "#1a1a1a" : "#ccc",
                border: "none", padding: "6px 14px", borderRadius: 999,
                cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif",
                textTransform: "capitalize"
              }}>{p === "home" ? "Beranda" : p === "menu" ? "Menu" : p === "reservasi" ? "Reservasi" : "Status"}</button>
            ))}
            <button onClick={() => { setPage("menu"); }} style={{
              background: "#f59e0b", color: "#1a1a1a", border: "none",
              padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 13, fontWeight: "bold"
            }}>🛒 {cartCount}</button>
            <button onClick={() => setPage(isAdmin ? "admin" : "adminlogin")} style={{
              background: "none", color: "#888", border: "1px solid #444",
              padding: "5px 12px", borderRadius: 999, cursor: "pointer", fontSize: 12
            }}>Admin</button>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        {/* HOME */}
        {page === "home" && (
          <div>
            <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>🍽</div>
              <h1 style={{ fontSize: 42, fontWeight: "normal", margin: "0 0 12px", letterSpacing: 3 }}>marikumur</h1>
              <p style={{ color: "#666", fontSize: 16, margin: "0 0 32px" }}>Pesan makanan & reservasi meja dengan mudah</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setPage("menu")} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "14px 32px", borderRadius: 999, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>Lihat Menu</button>
                <button onClick={() => setPage("reservasi")} style={{ background: "none", color: "#1a1a1a", border: "2px solid #1a1a1a", padding: "14px 32px", borderRadius: 999, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>Reservasi Meja</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
              {[["download.jpg","Menu Lengkap","Berbagai pilihan masakan nusantara"],["📅","Reservasi Mudah","Pesan meja untuk acara spesialmu"],["🔍","Lacak Pesanan","Pantau status pesananmu real-time"]].map(([e,t,d]) => (
                <div key={t} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{e}</div>
                  <div style={{ fontWeight: "bold", marginBottom: 6 }}>{t}</div>
                  <div style={{ color: "#888", fontSize: 13 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENU */}
        {page === "menu" && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: "normal", marginBottom: 20, letterSpacing: 1 }}>Menu Kami</h2>
            {/* Category filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)} style={{
                  background: activeCategory === c ? "#1a1a1a" : "#fff",
                  color: activeCategory === c ? "#fff" : "#666",
                  border: "1px solid #ddd", padding: "6px 16px",
                  borderRadius: 999, cursor: "pointer", fontSize: 13
                }}>{c}</button>
              ))}
            </div>
            {/* Menu grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 32 }}>
              {filteredMenu.map(item => {
                const inCart = cart.find(i => i.id === item.id)
                return (
                  <div key={item.id} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
                    <img
  src={item.image}
  alt={item.name}
  style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", marginBottom: 2 }}>{item.name}</div>
                      <div style={{ color: "#888", fontSize: 12, marginBottom: 6 }}>{item.desc}</div>
                      <div style={{ color: "#c8772a", fontWeight: "bold" }}>{formatRupiah(item.price)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      {inCart ? (
                        <>
                          <button onClick={() => removeFromCart(item.id)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 16 }}>−</button>
                          <span style={{ minWidth: 20, textAlign: "center", fontWeight: "bold" }}>{inCart.qty}</span>
                          <button onClick={() => addToCart(item)} style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: 16 }}>+</button>
                        </>
                      ) : (
                        <button onClick={() => addToCart(item)} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 13 }}>+ Tambah</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cart */}
            {cart.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontWeight: "normal", fontSize: 18 }}>🛒 Keranjang</h3>
                {cart.map(i => (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0ece8", fontSize: 14 }}>
                    <span>{i.name} × {i.qty}</span>
                    <span style={{ color: "#c8772a" }}>{formatRupiah(i.price * i.qty)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: "bold" }}>
                  <span>Total</span><span style={{ color: "#c8772a" }}>{formatRupiah(totalCart)}</span>
                </div>
                <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                  <input placeholder="Nama kamu *" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", boxSizing: "border-box" }} />
                  <select value={form.table} onChange={e => setForm({...form, table: e.target.value})}
                    style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", background: "#fff" }}>
                    <option value="">Pilih nomor meja *</option>
                    {tables.map(t => <option key={t} value={t}>Meja {t}</option>)}
                  </select>
                  <input placeholder="Catatan (opsional)" value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                    style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", boxSizing: "border-box" }} />
                  <button onClick={submitOrder} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>Pesan Sekarang</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESERVASI */}
        {page === "reservasi" && (
          <div style={{ maxWidth: 480 }}>
            <h2 style={{ fontSize: 28, fontWeight: "normal", marginBottom: 8, letterSpacing: 1 }}>Reservasi Meja</h2>
            <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>Pesan meja untuk acara atau kunjungan spesial kamu.</p>
            <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: 24, display: "grid", gap: 12 }}>
              <input placeholder="Nama pemesan *" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", boxSizing: "border-box" }} />
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", boxSizing: "border-box" }} />
              <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", boxSizing: "border-box" }} />
              <input type="number" placeholder="Jumlah tamu *" value={form.guests} onChange={e => setForm({...form, guests: e.target.value})}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", boxSizing: "border-box" }} />
              <input placeholder="Catatan khusus (opsional)" value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", boxSizing: "border-box" }} />
              <button onClick={submitReservasi} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>Konfirmasi Reservasi</button>
            </div>
            {reservations.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontWeight: "normal", marginBottom: 12 }}>Reservasi Kamu</h3>
                {reservations.map(r => (
                  <div key={r.kode} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 10, padding: 16, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: "bold" }}>{r.name}</span>
                      <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 10px", borderRadius: 999, fontSize: 12 }}>{r.status}</span>
                    </div>
                    <div style={{ color: "#888", fontSize: 13 }}>{r.date} · {r.time} · {r.guests} tamu</div>
                    <div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>Kode: {r.kode}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATUS */}
        {page === "status" && (
          <div style={{ maxWidth: 480 }}>
            <h2 style={{ fontSize: 28, fontWeight: "normal", marginBottom: 8, letterSpacing: 1 }}>Status Pesanan</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input placeholder="Masukkan kode pesanan" value={searchKode} onChange={e => setSearchKode(e.target.value.toUpperCase())}
                style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14 }} />
              <button onClick={cariOrder} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>Cari</button>
            </div>
            {foundOrder && (
              <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 16 }}>{foundOrder.name}</div>
                    <div style={{ color: "#888", fontSize: 13 }}>Meja {foundOrder.table} · {foundOrder.time}</div>
                  </div>
                  <span style={{ background: statusColor[foundOrder.status] + "22", color: statusColor[foundOrder.status], padding: "4px 14px", borderRadius: 999, fontSize: 13, fontWeight: "bold" }}>{foundOrder.status}</span>
                </div>
                {foundOrder.items.map(i => (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <span>{i.name} × {i.qty}</span>
                    <span>{formatRupiah(i.price * i.qty)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: "bold" }}>
                  <span>Total</span><span style={{ color: "#c8772a" }}>{formatRupiah(foundOrder.total)}</span>
                </div>
                {foundOrder.note && <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>Catatan: {foundOrder.note}</div>}
              </div>
            )}
            {orders.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontWeight: "normal", marginBottom: 12 }}>Semua Pesanan</h3>
                {orders.map(o => (
                  <div key={o.kode} onClick={() => setFoundOrder(o)} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 10, padding: "12px 16px", marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 14 }}>{o.name} — Meja {o.table}</div>
                      <div style={{ color: "#aaa", fontSize: 12 }}>{o.kode} · {o.time}</div>
                    </div>
                    <span style={{ background: statusColor[o.status] + "22", color: statusColor[o.status], padding: "3px 12px", borderRadius: 999, fontSize: 12 }}>{o.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADMIN LOGIN */}
        {page === "adminlogin" && (
          <div style={{ maxWidth: 360, margin: "60px auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: "normal", marginBottom: 20, textAlign: "center" }}>Login Admin</h2>
            <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: 24, display: "grid", gap: 12 }}>
              <input type="password" placeholder="Password" value={adminPass} onChange={e => setAdminPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && loginAdmin()}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14 }} />
              <button onClick={loginAdmin} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: 12, borderRadius: 8, fontSize: 15, cursor: "pointer" }}>Masuk</button>
              <p style={{ color: "#aaa", fontSize: 12, textAlign: "center", margin: 0 }}>Password demo: admin123</p>
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {page === "admin" && isAdmin && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: "normal", margin: 0 }}>Dashboard Admin</h2>
              <button onClick={() => { setIsAdmin(false); setPage("home") }} style={{ background: "none", border: "1px solid #ddd", padding: "6px 16px", borderRadius: 999, cursor: "pointer", fontSize: 13 }}>Keluar</button>
            </div>
            {/* Tab */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["orders","menu","reservasi"].map(v => (
                <button key={v} onClick={() => setAdminView(v)} style={{
                  background: adminView === v ? "#1a1a1a" : "#fff",
                  color: adminView === v ? "#fff" : "#666",
                  border: "1px solid #ddd", padding: "8px 20px",
                  borderRadius: 999, cursor: "pointer", fontSize: 13
                }}>{v === "orders" ? "Pesanan" : v === "menu" ? "Menu" : "Reservasi"}</button>
              ))}
            </div>

            {adminView === "orders" && (
              <div>
                {adminOrders.length === 0 && <p style={{ color: "#aaa" }}>Belum ada pesanan masuk.</p>}
                {adminOrders.map(o => (
                  <div key={o.kode} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <span style={{ fontWeight: "bold" }}>{o.name}</span>
                        <span style={{ color: "#888", fontSize: 13 }}> — Meja {o.table} · {o.time}</span>
                      </div>
                      <span style={{ background: statusColor[o.status] + "22", color: statusColor[o.status], padding: "3px 12px", borderRadius: 999, fontSize: 13, fontWeight: "bold" }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#666", marginBottom: 10 }}>
                      {o.items.map(i => `${i.name} ×${i.qty}`).join(", ")}
                      {o.note && ` · Catatan: ${o.note}`}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "bold", color: "#c8772a" }}>{formatRupiah(o.total)}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        {["Diproses","Siap","Selesai","Ditolak"].map(s => (
                          <button key={s} onClick={() => updateStatus(o.kode, s)} style={{
                            background: o.status === s ? statusColor[s] : "#fff",
                            color: o.status === s ? "#fff" : "#666",
                            border: "1px solid #ddd", padding: "5px 12px",
                            borderRadius: 999, cursor: "pointer", fontSize: 12
                          }}>{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {adminView === "menu" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                {menuData.map(item => (
                  <div key={item.id} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 10, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
                    <img
  src={item.image}
  alt={item.name}
  style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: 14 }}>{item.name}</div>
                      <div style={{ color: "#c8772a", fontSize: 13 }}>{formatRupiah(item.price)}</div>
                      <div style={{ color: "#aaa", fontSize: 11 }}>{item.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {adminView === "reservasi" && (
              <div>
                {reservations.length === 0 && <p style={{ color: "#aaa" }}>Belum ada reservasi.</p>}
                {reservations.map(r => (
                  <div key={r.kode} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 10, padding: 16, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: "bold" }}>{r.name}</div>
                        <div style={{ color: "#888", fontSize: 13 }}>{r.date} · {r.time} · {r.guests} tamu</div>
                        {r.note && <div style={{ color: "#aaa", fontSize: 12 }}>Catatan: {r.note}</div>}
                      </div>
                      <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 12px", borderRadius: 999, fontSize: 12, height: "fit-content" }}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}