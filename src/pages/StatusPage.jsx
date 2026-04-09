import { useState } from "react"
import { useApp } from "../context/AppContext"
import { useIsMobile } from "../hooks/useIsMobile"
import { formatRupiah } from "../utils/helpers"
import { STATUS_COLOR } from "../data/menuData"

export default function StatusPage() {
  const { orders, showNotif } = useApp()
  const isMobile = useIsMobile()
  const [searchKode, setSearchKode] = useState("")
  const [foundOrder, setFoundOrder] = useState(null)

  function cariOrder() {
    const found = orders.find(o => o.kode === searchKode.toUpperCase())
    setFoundOrder(found || null)
    if (!found) showNotif("Kode pesanan tidak ditemukan")
  }

  function handlePrint(order) {
    const w = window.open("", "_blank", "width=380,height=600")
    w.document.write(`
      <html><head><title>Struk - ${order.kode}</title>
      <style>
        body { font-family: 'Courier New', monospace; padding: 20px; font-size: 13px; }
        h2 { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 12px; }
        .row { display: flex; justify-content: space-between; margin: 4px 0; }
        .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 8px; font-weight: bold; }
        .footer { text-align: center; margin-top: 16px; font-size: 11px; color: #666; }
      </style></head><body>
      <h2>🍽 marikumur</h2>
      <div class="row"><span>Kode</span><span>${order.kode}</span></div>
      <div class="row"><span>Nama</span><span>${order.name}</span></div>
      <div class="row"><span>Meja</span><span>${order.table}</span></div>
      <div class="row"><span>Waktu</span><span>${order.time}</span></div>
      <div class="row"><span>Status</span><span>${order.status}</span></div>
      <br/>
      ${order.items.map(i => `<div class="row"><span>${i.name} ×${i.qty}</span><span>Rp ${(i.price * i.qty).toLocaleString("id-ID")}</span></div>`).join("")}
      <div class="row total"><span>Total</span><span>Rp ${order.total.toLocaleString("id-ID")}</span></div>
      ${order.note ? `<br/><div>Catatan: ${order.note}</div>` : ""}
      <div class="footer">Terima kasih sudah makan di marikumur! 🙏</div>
      </body></html>
    `)
    w.document.close()
    w.print()
  }

  return (
    <div style={{ animation: "pageIn 0.25s ease" }}>
      <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: "normal", marginBottom: 14, letterSpacing: 1, color: "var(--text)" }}>Status Pesanan</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Masukkan kode pesanan (MKxxxxx)"
          value={searchKode}
          onChange={e => setSearchKode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && cariOrder()}
          style={{
            flex: 1, border: "1px solid var(--border)", borderRadius: 8,
            padding: "11px 14px", fontSize: 14, background: "var(--input-bg)",
            color: "var(--text)", outline: "none",
          }}
        />
        <button onClick={cariOrder} style={{
          background: "#1a1a1a", color: "#fff", border: "none",
          padding: "10px 16px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap",
        }}>Cari</button>
      </div>

      {foundOrder && (
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border)",
          borderRadius: 12, padding: isMobile ? 14 : 20, marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: "bold", fontSize: 15, color: "var(--text)" }}>{foundOrder.name}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Meja {foundOrder.table} · {foundOrder.time}</div>
            </div>
            <span style={{
              background: STATUS_COLOR[foundOrder.status] + "22",
              color: STATUS_COLOR[foundOrder.status],
              padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: "bold", flexShrink: 0,
            }}>{foundOrder.status}</span>
          </div>
          {foundOrder.items.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid var(--border)", color: "var(--text)" }}>
              <span>{i.name} × {i.qty}</span>
              <span>{formatRupiah(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: "bold", fontSize: 14, color: "var(--text)" }}>
            <span>Total</span>
            <span style={{ color: "#c8772a" }}>{formatRupiah(foundOrder.total)}</span>
          </div>
          {foundOrder.note && <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: 12 }}>Catatan: {foundOrder.note}</div>}
          <button onClick={() => handlePrint(foundOrder)} style={{
            marginTop: 14, background: "none", border: "1px solid var(--border)",
            color: "var(--text)", padding: "8px 16px", borderRadius: 8,
            cursor: "pointer", fontSize: 13, width: "100%",
          }}>🖨 Print Struk</button>
        </div>
      )}

      {orders.length > 0 && (
        <div>
          <h3 style={{ fontWeight: "normal", marginBottom: 10, fontSize: 15, color: "var(--text)" }}>Semua Pesanan</h3>
          {[...orders].reverse().map(o => (
            <div key={o.kode} onClick={() => setFoundOrder(o)} style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "12px 14px", marginBottom: 8,
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
              transition: "box-shadow 0.15s",
            }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: 13, color: "var(--text)" }}>{o.name} — Meja {o.table}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 11 }}>{o.kode} · {o.time}</div>
              </div>
              <span style={{
                background: STATUS_COLOR[o.status] + "22",
                color: STATUS_COLOR[o.status],
                padding: "3px 10px", borderRadius: 999, fontSize: 11, flexShrink: 0,
              }}>{o.status}</span>
            </div>
          ))}
        </div>
      )}

      {orders.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "48px 0", fontSize: 14 }}>
          Belum ada pesanan. Yuk pesan dulu! 🍽
        </div>
      )}
    </div>
  )
}
