import { useState, useEffect } from "react"

const menuData = [
  { id: 1, name: "Nasi Goreng Spesial", desc: "Nasi goreng dengan telur, ayam, dan kerupuk", price: 25000, category: "Nasi", image: "download.jpg" },
  { id: 2, name: "Mie Ayam Bakso", desc: "Mie ayam dengan bakso sapi dan pangsit goreng", price: 22000, category: "Mie", image: "download.jpg" },
  { id: 3, name: "Ayam Bakar", desc: "Ayam bakar bumbu kecap dengan lalapan segar", price: 32000, category: "Ayam", image: "download.jpg" },
  { id: 4, name: "Soto Ayam", desc: "Soto kuning dengan suwiran ayam dan lontong", price: 20000, category: "Sup", image: "download.jpg" },
  { id: 5, name: "Gado-gado", desc: "Sayuran segar dengan bumbu kacang spesial", price: 18000, category: "Sayur", image: "download.jpg" },
  { id: 6, name: "Es Teh Manis", desc: "Teh manis segar dengan es batu", price: 5000, category: "Minuman", image: "download.jpg" },
  { id: 7, name: "Es Jeruk", desc: "Jeruk peras segar dengan es batu", price: 8000, category: "Minuman", image: "download.jpg" },
  { id: 8, name: "Pisang Goreng", desc: "Pisang goreng crispy dengan coklat meses", price: 12000, category: "Snack", image: "download.jpg" },
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", handle)
    return () => window.removeEventListener("resize", handle)
  }, [])

  const categories = ["Semua", ...new Set(menuData.map(m => m.category))]
  const filteredMenu = activeCategory === "Semua" ? menuData : menuData.filter(m => m.category === activeCategory)
  const totalCart = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s,i) => s+i.qty, 0)

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
    setCartOpen(false)
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

  const inp = {
    border: "1px solid #ddd", borderRadius: 8,
    padding: "11px 14px", fontSize: 14,
    width: "100%", boxSizing: "border-box",
    background: "#fff", color: "#1a1a1a"
  }

  const btn = {
    background: "#1a1a1a", color: "#fff", border: "none",
    padding: "12px", borderRadius: 8, fontSize: 15,
    cursor: "pointer", fontFamily: "Georgia, serif", width: "100%"
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6", fontFamily: "'Georgia', serif", color: "#1a1a1a" }}>

      {/* Notifikasi */}
      {notification && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          background: "#1a1a1a", color: "#fff", padding: "10px 20px",
          borderRadius: 999, fontSize: 13, zIndex: 9999,
          whiteSpace: "nowrap", maxWidth: "90vw",
          overflow: "hidden", textOverflow: "ellipsis"
        }}>{notification}</div>
      )}

      {/* Header */}
      <header style={{ background: "#1a1a1a", color: "#fff", padding: "0 16px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, fontFamily: "Georgia, serif", cursor: "pointer", letterSpacing: 2 }}>
            🍽 marikumur
          </button>
          {/* Desktop nav */}
          {!isMobile && (
            <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {["home","menu","reservasi","status"].map(p => (
                <button key={p} onClick={() => setPage(p)} style={{
                  background: page === p ? "#fff" : "none",
                  color: page === p ? "#1a1a1a" : "#ccc",
                  border: "none", padding: "6px 14px", borderRadius: 999,
                  cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif"
                }}>{p === "home" ? "Beranda" : p === "menu" ? "Menu" : p === "reservasi" ? "Reservasi" : "Status"}</button>
              ))}
              <button onClick={() => { setPage("menu"); setCartOpen(true) }} style={{
                background: "#f59e0b", color: "#1a1a1a", border: "none",
                padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 13, fontWeight: "bold"
              }}>🛒 {cartCount}</button>
              <button onClick={() => setPage(isAdmin ? "admin" : "adminlogin")} style={{
                background: "none", color: "#888", border: "1px solid #444",
                padding: "5px 12px", borderRadius: 999, cursor: "pointer", fontSize: 12
              }}>Admin</button>
            </nav>
          )}
          {/* Mobile icons */}
          {isMobile && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => { setPage("menu"); setCartOpen(true) }} style={{
                background: "#f59e0b", color: "#1a1a1a", border: "none",
                padding: "6px 12px", borderRadius: 999, cursor: "pointer", fontSize: 13, fontWeight: "bold"
              }}>🛒 {cartCount}</button>
              <button onClick={() => setPage(isAdmin ? "admin" : "adminlogin")} style={{
                background: "none", color: "#888", border: "1px solid #444",
                padding: "5px 10px", borderRadius: 999, cursor: "pointer", fontSize: 11
              }}>Admin</button>
            </div>
          )}
        </div>
      </header>

      {/* Bottom nav mobile */}
      {isMobile && (
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#1a1a1a", display: "flex", zIndex: 100,
          borderTop: "1px solid #333"
        }}>
          {[["home","🏠","Beranda"],["menu","🍽","Menu"],["reservasi","📅","Reservasi"],["status","🔍","Status"]].map(([p,e,label]) => (
            <button key={p} onClick={() => setPage(p)} style={{
              flex: 1, background: "none", border: "none",
              color: page === p ? "#f59e0b" : "#888",
              padding: "10px 0 8px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2
            }}>
              <span style={{ fontSize: 18 }}>{e}</span>
              <span style={{ fontSize: 10 }}>{label}</span>
            </button>
          ))}
        </nav>
      )}

      <main style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "20px 14px 80px" : "32px 24px" }}>

        {/* HOME */}
        {page === "home" && (
          <div>
            <div style={{ textAlign: "center", padding: isMobile ? "24px 0 20px" : "40px 0 32px" }}>
              <div style={{ fontSize: isMobile ? 44 : 56, marginBottom: 8 }}>🍽</div>
              <h1 style={{ fontSize: isMobile ? 30 : 42, fontWeight: "normal", margin: "0 0 10px", letterSpacing: 3 }}>marikumur</h1>
              <p style={{ color: "#666", fontSize: isMobile ? 14 : 16, margin: "0 0 24px" }}>Pesan makanan & reservasi meja dengan mudah</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setPage("menu")} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: isMobile ? "12px 24px" : "14px 32px", borderRadius: 999, fontSize: isMobile ? 14 : 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>Lihat Menu</button>
                <button onClick={() => setPage("reservasi")} style={{ background: "none", color: "#1a1a1a", border: "2px solid #1a1a1a", padding: isMobile ? "12px 24px" : "14px 32px", borderRadius: 999, fontSize: isMobile ? 14 : 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>Reservasi Meja</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 12, marginTop: 8 }}>
              {[["🍳","Menu Lengkap","Berbagai pilihan masakan nusantara"],["📅","Reservasi Mudah","Pesan meja untuk acara spesialmu"],["🔍","Lacak Pesanan","Pantau status pesananmu real-time"]].map(([e,t,d]) => (
                <div key={t} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: "20px 16px", textAlign: "center", display: "flex", gap: isMobile ? 14 : 0, alignItems: isMobile ? "center" : "initial", flexDirection: isMobile ? "row" : "column" }}>
                  <div style={{ fontSize: 26, marginBottom: isMobile ? 0 : 8, flexShrink: 0 }}>{e}</div>
                  <div style={{ textAlign: isMobile ? "left" : "center" }}>
                    <div style={{ fontWeight: "bold", marginBottom: 4, fontSize: 14 }}>{t}</div>
                    <div style={{ color: "#888", fontSize: 12 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENU */}
        {page === "menu" && (
          <div>
            <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: "normal", marginBottom: 16, letterSpacing: 1 }}>Menu Kami</h2>
            {/* Category filter */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)} style={{
                  background: activeCategory === c ? "#1a1a1a" : "#fff",
                  color: activeCategory === c ? "#fff" : "#666",
                  border: "1px solid #ddd", padding: "6px 14px",
                  borderRadius: 999, cursor: "pointer", fontSize: 12,
                  whiteSpace: "nowrap", flexShrink: 0
                }}>{c}</button>
              ))}
            </div>
            {/* Menu list */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 10, marginBottom: 24 }}>
              {filteredMenu.map(item => {
                const inCart = cart.find(i => i.id === item.id)
                return (
                  <div key={item.id} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 2 }}>{item.name}</div>
                      <div style={{ color: "#888", fontSize: 11, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</div>
                      <div style={{ color: "#c8772a", fontWeight: "bold", fontSize: 13 }}>{formatRupiah(item.price)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                      {inCart ? (
                        <>
                          <button onClick={() => removeFromCart(item.id)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <span style={{ minWidth: 18, textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{inCart.qty}</span>
                          <button onClick={() => addToCart(item)} style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        </>
                      ) : (
                        <button onClick={() => addToCart(item)} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 999, cursor: "pointer", fontSize: 12 }}>+</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cart — slide up on mobile */}
            {cart.length > 0 && (
              <>
                {isMobile && (
                  <button onClick={() => setCartOpen(!cartOpen)} style={{
                    position: "fixed", bottom: 70, left: 16, right: 16,
                    background: "#1a1a1a", color: "#fff", border: "none",
                    padding: 14, borderRadius: 12, fontSize: 14, cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontFamily: "Georgia, serif", zIndex: 90
                  }}>
                    <span>🛒 {cartCount} item</span>
                    <span style={{ color: "#f59e0b" }}>{formatRupiah(totalCart)} {cartOpen ? "▼" : "▲"}</span>
                  </button>
                )}
                {(!isMobile || cartOpen) && (
                  <div style={isMobile ? {
                    position: "fixed", bottom: 120, left: 0, right: 0,
                    background: "#fff", borderRadius: "16px 16px 0 0",
                    padding: 20, zIndex: 89, maxHeight: "70vh", overflowY: "auto",
                    boxShadow: "0 -4px 24px rgba(0,0,0,0.12)"
                  } : {
                    background: "#fff", border: "1px solid #e8e4df",
                    borderRadius: 12, padding: 20
                  }}>
                    <h3 style={{ margin: "0 0 14px", fontWeight: "normal", fontSize: 16 }}>🛒 Keranjang</h3>
                    {cart.map(i => (
                      <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}>
                        <span>{i.name} × {i.qty}</span>
                        <span style={{ color: "#c8772a" }}>{formatRupiah(i.price * i.qty)}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: "bold", fontSize: 14 }}>
                      <span>Total</span><span style={{ color: "#c8772a" }}>{formatRupiah(totalCart)}</span>
                    </div>
                    <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                      <input placeholder="Nama kamu *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inp} />
                      <select value={form.table} onChange={e => setForm({...form, table: e.target.value})} style={{...inp, background: "#fff"}}>
                        <option value="">Pilih nomor meja *</option>
                        {tables.map(t => <option key={t} value={t}>Meja {t}</option>)}
                      </select>
                      <input placeholder="Catatan (opsional)" value={form.note} onChange={e => setForm({...form, note: e.target.value})} style={inp} />
                      <button onClick={submitOrder} style={btn}>Pesan Sekarang</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* RESERVASI */}
        {page === "reservasi" && (
          <div>
            <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: "normal", marginBottom: 6, letterSpacing: 1 }}>Reservasi Meja</h2>
            <p style={{ color: "#888", marginBottom: 20, fontSize: 13 }}>Pesan meja untuk acara atau kunjungan spesial kamu.</p>
            <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: isMobile ? 16 : 24, display: "grid", gap: 10 }}>
              <input placeholder="Nama pemesan *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inp} />
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inp} />
              <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} style={inp} />
              <input type="number" placeholder="Jumlah tamu *" value={form.guests} onChange={e => setForm({...form, guests: e.target.value})} style={inp} />
              <input placeholder="Catatan khusus (opsional)" value={form.note} onChange={e => setForm({...form, note: e.target.value})} style={inp} />
              <button onClick={submitReservasi} style={btn}>Konfirmasi Reservasi</button>
            </div>
            {reservations.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ fontWeight: "normal", marginBottom: 10, fontSize: 16 }}>Reservasi Kamu</h3>
                {reservations.map(r => (
                  <div key={r.kode} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 10, padding: 14, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: "bold", fontSize: 14 }}>{r.name}</span>
                      <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 10px", borderRadius: 999, fontSize: 11 }}>{r.status}</span>
                    </div>
                    <div style={{ color: "#888", fontSize: 12 }}>{r.date} · {r.time} · {r.guests} tamu</div>
                    <div style={{ color: "#aaa", fontSize: 11, marginTop: 3 }}>Kode: {r.kode}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATUS */}
        {page === "status" && (
          <div>
            <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: "normal", marginBottom: 14, letterSpacing: 1 }}>Status Pesanan</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input placeholder="Masukkan kode pesanan" value={searchKode} onChange={e => setSearchKode(e.target.value.toUpperCase())}
                style={{ ...inp, flex: 1, width: "auto" }} />
              <button onClick={cariOrder} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}>Cari</button>
            </div>
            {foundOrder && (
              <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: isMobile ? 14 : 20, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 15 }}>{foundOrder.name}</div>
                    <div style={{ color: "#888", fontSize: 12 }}>Meja {foundOrder.table} · {foundOrder.time}</div>
                  </div>
                  <span style={{ background: statusColor[foundOrder.status] + "22", color: statusColor[foundOrder.status], padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: "bold", flexShrink: 0 }}>{foundOrder.status}</span>
                </div>
                {foundOrder.items.map(i => (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <span>{i.name} × {i.qty}</span>
                    <span>{formatRupiah(i.price * i.qty)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: "bold", fontSize: 14 }}>
                  <span>Total</span><span style={{ color: "#c8772a" }}>{formatRupiah(foundOrder.total)}</span>
                </div>
                {foundOrder.note && <div style={{ marginTop: 6, color: "#888", fontSize: 12 }}>Catatan: {foundOrder.note}</div>}
              </div>
            )}
            {orders.length > 0 && (
              <div>
                <h3 style={{ fontWeight: "normal", marginBottom: 10, fontSize: 15 }}>Semua Pesanan</h3>
                {orders.map(o => (
                  <div key={o.kode} onClick={() => setFoundOrder(o)} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 10, padding: "12px 14px", marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 13 }}>{o.name} — Meja {o.table}</div>
                      <div style={{ color: "#aaa", fontSize: 11 }}>{o.kode} · {o.time}</div>
                    </div>
                    <span style={{ background: statusColor[o.status] + "22", color: statusColor[o.status], padding: "3px 10px", borderRadius: 999, fontSize: 11, flexShrink: 0 }}>{o.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADMIN LOGIN */}
        {page === "adminlogin" && (
          <div style={{ maxWidth: 360, margin: "40px auto" }}>
            <h2 style={{ fontSize: 22, fontWeight: "normal", marginBottom: 20, textAlign: "center" }}>Login Admin</h2>
            <div style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: isMobile ? 16 : 24, display: "grid", gap: 10 }}>
              <input type="password" placeholder="Password" value={adminPass} onChange={e => setAdminPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && loginAdmin()} style={inp} />
              <button onClick={loginAdmin} style={btn}>Masuk</button>
              <p style={{ color: "#aaa", fontSize: 12, textAlign: "center", margin: 0 }}>Password demo: admin123</p>
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {page === "admin" && isAdmin && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: "normal", margin: 0 }}>Dashboard Admin</h2>
              <button onClick={() => { setIsAdmin(false); setPage("home") }} style={{ background: "none", border: "1px solid #ddd", padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 12 }}>Keluar</button>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {["orders","menu","reservasi"].map(v => (
                <button key={v} onClick={() => setAdminView(v)} style={{
                  background: adminView === v ? "#1a1a1a" : "#fff",
                  color: adminView === v ? "#fff" : "#666",
                  border: "1px solid #ddd", padding: "8px 18px",
                  borderRadius: 999, cursor: "pointer", fontSize: 13,
                  whiteSpace: "nowrap", flexShrink: 0
                }}>{v === "orders" ? "Pesanan" : v === "menu" ? "Menu" : "Reservasi"}</button>
              ))}
            </div>

            {adminView === "orders" && (
              <div>
                {adminOrders.length === 0 && <p style={{ color: "#aaa", fontSize: 13 }}>Belum ada pesanan masuk.</p>}
                {adminOrders.map(o => (
                  <div key={o.kode} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 12, padding: isMobile ? 12 : 16, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div>
                        <span style={{ fontWeight: "bold", fontSize: 14 }}>{o.name}</span>
                        <span style={{ color: "#888", fontSize: 12 }}> — Meja {o.table} · {o.time}</span>
                      </div>
                      <span style={{ background: statusColor[o.status] + "22", color: statusColor[o.status], padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: "bold", flexShrink: 0 }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
                      {o.items.map(i => `${i.name} ×${i.qty}`).join(", ")}
                      {o.note && ` · ${o.note}`}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontWeight: "bold", color: "#c8772a", fontSize: 14 }}>{formatRupiah(o.total)}</span>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {["Diproses","Siap","Selesai","Ditolak"].map(s => (
                          <button key={s} onClick={() => updateStatus(o.kode, s)} style={{
                            background: o.status === s ? statusColor[s] : "#fff",
                            color: o.status === s ? "#fff" : "#666",
                            border: "1px solid #ddd", padding: "4px 10px",
                            borderRadius: 999, cursor: "pointer", fontSize: 11
                          }}>{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {adminView === "menu" && (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 10 }}>
                {menuData.map(item => (
                  <div key={item.id} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 10, padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: 13 }}>{item.name}</div>
                      <div style={{ color: "#c8772a", fontSize: 12 }}>{formatRupiah(item.price)}</div>
                      <div style={{ color: "#aaa", fontSize: 11 }}>{item.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {adminView === "reservasi" && (
              <div>
                {reservations.length === 0 && <p style={{ color: "#aaa", fontSize: 13 }}>Belum ada reservasi.</p>}
                {reservations.map(r => (
                  <div key={r.kode} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 10, padding: 14, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: 14 }}>{r.name}</div>
                        <div style={{ color: "#888", fontSize: 12 }}>{r.date} · {r.time} · {r.guests} tamu</div>
                        {r.note && <div style={{ color: "#aaa", fontSize: 11 }}>Catatan: {r.note}</div>}
                      </div>
                      <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 10px", borderRadius: 999, fontSize: 11, flexShrink: 0 }}>{r.status}</span>
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