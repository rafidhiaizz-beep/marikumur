import { useState } from "react"
import { useApp } from "../context/AppContext"
import { useIsMobile } from "../hooks/useIsMobile"

export default function ReservasiPage() {
  const { submitReservasi, deleteReservasi, reservations, showNotif, openConfirm } = useApp()
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ name: "", date: "", time: "", guests: "", note: "" })

  const inp = {
    border: "1px solid var(--border)", borderRadius: 8,
    padding: "11px 14px", fontSize: 14, width: "100%",
    boxSizing: "border-box", background: "var(--input-bg)",
    color: "var(--text)", outline: "none",
  }

  function handleSubmit() {
    if (!form.name || !form.date || !form.time || !form.guests) {
      showNotif("Semua field wajib diisi!")
      return
    }
    const rsv = submitReservasi(form)
    setForm({ name: "", date: "", time: "", guests: "", note: "" })
    showNotif(`Reservasi berhasil! Kode: ${rsv.kode}`)
  }

  async function handleDelete(r) {
    const ok = await openConfirm({
      title: "Batalkan Reservasi?",
      message: `Reservasi ${r.kode} atas nama ${r.name} akan dibatalkan.`,
    })
    if (ok) {
      deleteReservasi(r.kode)
      showNotif("Reservasi dibatalkan.")
    }
  }

  return (
    <div style={{ animation: "pageIn 0.25s ease" }}>
      <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: "normal", marginBottom: 6, letterSpacing: 1, color: "var(--text)" }}>
        Reservasi Meja
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: 13 }}>
        Pesan meja untuk acara atau kunjungan spesial kamu.
      </p>

      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: 12, padding: isMobile ? 16 : 24, display: "grid", gap: 10,
      }}>
        <input placeholder="Nama pemesan *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} />
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inp} />
        <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={inp} />
        <input type="number" min="1" placeholder="Jumlah tamu *" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} style={inp} />
        <input placeholder="Catatan khusus (opsional)" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={inp} />
        <button onClick={handleSubmit} style={{
          background: "#1a1a1a", color: "#fff", border: "none",
          padding: "13px", borderRadius: 8, fontSize: 15,
          cursor: "pointer", fontFamily: "Georgia, serif",
        }}>Konfirmasi Reservasi</button>
      </div>

      {reservations.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontWeight: "normal", marginBottom: 12, fontSize: 16, color: "var(--text)" }}>
            Daftar Reservasi
          </h3>
          {reservations.map(r => (
            <div key={r.kode} style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: 10, padding: 14, marginBottom: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", fontSize: 14, color: "var(--text)" }}>{r.name}</span>
                <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 10px", borderRadius: 999, fontSize: 11 }}>
                  {r.status}
                </span>
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{r.date} · {r.time} · {r.guests} tamu</div>
              {r.note && <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>Catatan: {r.note}</div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ color: "#aaa", fontSize: 11 }}>Kode: {r.kode}</span>
                <button onClick={() => handleDelete(r)} style={{
                  background: "none", color: "#ef4444",
                  border: "1px solid #ef4444", padding: "4px 12px",
                  borderRadius: 999, fontSize: 11, cursor: "pointer",
                }}>Batalkan</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
