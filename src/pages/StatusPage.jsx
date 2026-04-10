import { useState } from "react"
import { useApp } from "../context/AppContext"
import { useIsMobile } from "../hooks/useIsMobile"
import { formatRupiah } from "../utils/helpers"
import { STATUS_COLOR } from "../data/menuData"

/* ── Timeline progress bar ──────────────────────────────────────────────── */
const ORDER_STAGES = [
  { key: "Menunggu",    icon: "🕐", label: "Diterima" },
  { key: "Diproses",   icon: "👨‍🍳", label: "Dimasak" },
  { key: "Siap",       icon: "🍽", label: "Siap" },
  { key: "Selesai",    icon: "✅", label: "Selesai" },
]

function OrderTimeline({ status }) {
  const currentIdx = ORDER_STAGES.findIndex(s => s.key === status)
  const activeIdx  = currentIdx >= 0 ? currentIdx : 0

  return (
    <div style={{
      display: "flex", alignItems: "center",
      margin: "16px 0 8px", gap: 0,
    }}>
      {ORDER_STAGES.map((stage, i) => {
        const done   = i <= activeIdx
        const active = i === activeIdx
        return (
          <div key={stage.key} style={{ display: "flex", alignItems: "center", flex: i < ORDER_STAGES.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: "50%",
                background: done
                  ? active
                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                    : "rgba(245,158,11,0.15)"
                  : "var(--bg)",
                border: done
                  ? "2px solid #f59e0b"
                  : "2px solid var(--border)",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: active ? "0 0 16px rgba(245,158,11,0.45)" : "none",
                transition: "all 0.3s",
                position: "relative",
              }}>
                {stage.icon}
                {active && (
                  <div style={{
                    position: "absolute", inset: -4,
                    borderRadius: "50%",
                    border: "2px solid rgba(245,158,11,0.3)",
                    animation: "pulse-glow 2s ease infinite",
                    pointerEvents: "none",
                  }} />
                )}
              </div>
              <span style={{
                fontSize: 9, letterSpacing: 0.5,
                color: done ? "#f59e0b" : "var(--text-muted)",
                fontWeight: active ? "bold" : "normal",
                whiteSpace: "nowrap",
                transition: "color 0.3s",
              }}>{stage.label}</span>
            </div>

            {i < ORDER_STAGES.length - 1 && (
              <div style={{
                flex: 1,
                height: 3,
                margin: "0 4px",
                marginBottom: 16,
                borderRadius: 2,
                background: i < activeIdx
                  ? "linear-gradient(90deg, #f59e0b, rgba(245,158,11,0.4))"
                  : "var(--border)",
                transition: "background 0.5s",
                position: "relative",
                overflow: "hidden",
              }}>
                {i === activeIdx - 1 && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    animation: "shimmer 1.5s ease infinite",
                    backgroundSize: "200% 100%",
                  }} />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Order card besar ─────────────────────────────────────────────────── */
function OrderDetailCard({ order, onPrint }) {
  const statusColor = STATUS_COLOR[order.status] || "#f59e0b"
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 20,
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      animation: "pageIn 0.35s ease",
    }}>
      {/* Top accent */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${statusColor}, ${statusColor}66, transparent)`,
      }} />

      <div style={{ padding: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <div style={{ fontWeight: "bold", fontSize: 16, color: "var(--text)" }}>{order.name}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>
              Meja {order.table} · {order.time}
            </div>
          </div>
          <span style={{
            background: statusColor + "20",
            color: statusColor,
            border: `1px solid ${statusColor}44`,
            padding: "5px 14px", borderRadius: 999,
            fontSize: 11, fontWeight: "bold",
          }}>{order.status}</span>
        </div>

        {/* Timeline */}
        <OrderTimeline status={order.status} />

        {/* Divider */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)",
          margin: "14px 0",
        }} />

        {/* Items */}
        <div style={{ marginBottom: 12 }}>
          {order.items.map(i => (
            <div key={i.id} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center",
              padding: "7px 0",
              borderBottom: "1px dashed var(--border)",
              fontSize: 13, color: "var(--text)",
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  width: 22, height: 22,
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: 6,
                  display: "flex", alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11, color: "#f59e0b", fontWeight: "bold",
                  flexShrink: 0,
                }}>×{i.qty}</span>
                {i.name}
              </span>
              <span style={{ color: "#c8772a", fontWeight: "bold" }}>
                {formatRupiah(i.price * i.qty)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(245,158,11,0.05)",
          border: "1px solid rgba(245,158,11,0.15)",
          borderRadius: 10, padding: "10px 14px",
          marginBottom: 12,
        }}>
          <span style={{ color: "var(--text)", fontSize: 14, fontWeight: "bold" }}>Total Pembayaran</span>
          <span style={{
            color: "#c8772a", fontSize: 18,
            fontWeight: "bold", fontFamily: "Georgia, serif",
          }}>{formatRupiah(order.total)}</span>
        </div>

        {order.note && (
          <div style={{
            background: "rgba(245,158,11,0.05)",
            border: "1px solid rgba(245,158,11,0.12)",
            borderRadius: 8, padding: "8px 12px",
            fontSize: 12, color: "var(--text-muted)",
            marginBottom: 12,
          }}>
            📝 {order.note}
          </div>
        )}

        {/* Kode & Print */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: 12, color: "var(--text-muted)",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 6, padding: "4px 10px",
          }}>{order.kode}</span>
          <button
            onClick={() => onPrint(order)}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "7px 16px", borderRadius: 999,
              fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.color = "#f59e0b" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)" }}
          >
            🖨 Print Struk
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Order mini card (list) ─────────────────────────────────────────────── */
function OrderMiniCard({ order, onClick, isActive }) {
  const statusColor = STATUS_COLOR[order.status] || "#f59e0b"
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${isActive ? "rgba(245,158,11,0.4)" : "var(--border)"}`,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "all 0.2s",
        boxShadow: isActive ? "0 4px 16px rgba(245,158,11,0.12)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)" }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = "var(--border)" }}
    >
      {/* Accent left bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: isActive ? "#f59e0b" : "transparent",
        borderRadius: "3px 0 0 3px",
        transition: "background 0.2s",
      }} />

      <div style={{ paddingLeft: 6 }}>
        <div style={{ fontWeight: "bold", fontSize: 13, color: "var(--text)" }}>
          {order.name}
          <span style={{ color: "var(--text-muted)", fontWeight: "normal", fontSize: 12 }}>
            {" "}— Meja {order.table}
          </span>
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>
          {order.kode} · {order.time}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
        <span style={{
          background: statusColor + "20",
          color: statusColor,
          border: `1px solid ${statusColor}44`,
          padding: "3px 10px", borderRadius: 999, fontSize: 10,
        }}>{order.status}</span>
        <span style={{ color: "#c8772a", fontSize: 11, fontWeight: "bold" }}>
          {formatRupiah(order.total)}
        </span>
      </div>
    </div>
  )
}

/* ── Main StatusPage ────────────────────────────────────────────────────── */
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
    <div style={{ animation: "pageIn 0.35s ease" }}>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 10, letterSpacing: 3, color: "#f59e0b",
          textTransform: "uppercase", marginBottom: 8,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{ width: 20, height: 1, background: "#f59e0b" }} />
          Lacak Pesanan
        </div>
        <h2 style={{
          fontSize: isMobile ? 26 : 34,
          fontWeight: "normal", letterSpacing: 2,
          color: "var(--text)", margin: "0 0 8px",
        }}>
          Status <span style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Pesanan</span>
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
          Pantau status pesananmu secara real-time
        </p>
      </div>

      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 14, padding: "16px",
        marginBottom: 24,
        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          fontSize: 10, letterSpacing: 1.5, color: "#f59e0b",
          textTransform: "uppercase", marginBottom: 10,
        }}>Cari dengan kode pesanan</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{
              position: "absolute", left: 14, top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14, color: "var(--text-muted)", pointerEvents: "none",
            }}>🔍</span>
            <input
              placeholder="Contoh: MK12345"
              value={searchKode}
              onChange={e => setSearchKode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && cariOrder()}
              style={{
                width: "100%", boxSizing: "border-box",
                border: "1px solid var(--border)",
                borderRadius: 10, padding: "11px 14px 11px 40px",
                fontSize: 14, background: "var(--input-bg)",
                color: "var(--text)", outline: "none",
                fontFamily: "monospace",
                letterSpacing: 1,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>
          <button
            onClick={cariOrder}
            style={{
              background: "linear-gradient(135deg, #1a1a1a, #2d1a0a)",
              color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)",
              padding: "10px 20px", borderRadius: 10,
              cursor: "pointer", fontSize: 13, whiteSpace: "nowrap",
              fontFamily: "Georgia, serif",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 18px rgba(245,158,11,0.25)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"}
          >
            Cari
          </button>
        </div>
      </div>

      {/* ── Detail order ditemukan ───────────────────────────────────────── */}
      {foundOrder && (
        <OrderDetailCard order={foundOrder} onPrint={handlePrint} />
      )}

      {/* ── Semua order ─────────────────────────────────────────────────── */}
      {orders.length > 0 && (
        <div>
          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
          }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4))" }} />
            <span style={{ fontSize: 9, letterSpacing: 2.5, color: "rgba(245,158,11,0.7)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              ✦ Semua Pesanan
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(245,158,11,0.4), transparent)" }} />
          </div>

          {[...orders].reverse().map(o => (
            <OrderMiniCard
              key={o.kode}
              order={o}
              isActive={foundOrder?.kode === o.kode}
              onClick={() => setFoundOrder(o)}
            />
          ))}
        </div>
      )}

      {orders.length === 0 && (
        <div style={{
          textAlign: "center", padding: "56px 0",
          color: "var(--text-muted)",
        }}>
          <div style={{
            fontSize: 52, marginBottom: 12, opacity: 0.3,
            animation: "floatUp 1s ease",
          }}>🍽</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Belum ada pesanan</div>
          <div style={{ fontSize: 12 }}>Yuk pesan dulu dan pantau statusnya di sini!</div>
        </div>
      )}
    </div>
  )
}
