import { useState } from "react"
import { useApp } from "../context/AppContext"
import { useIsMobile } from "../hooks/useIsMobile"

/* ── Ornamen ikon tamu ──────────────────────────────────────────────────── */
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8]

/* ── Time slot populer ─────────────────────────────────────────────────── */
const TIME_SLOTS = [
  "11:00", "11:30", "12:00", "12:30",
  "13:00", "17:00", "17:30", "18:00",
  "18:30", "19:00", "19:30", "20:00",
]

/* ── Status badge warna ────────────────────────────────────────────────── */
const STATUS_COLOR = {
  "Dikonfirmasi": "#10b981",
  "Menunggu": "#f59e0b",
  "Dibatalkan": "#ef4444",
}

export default function ReservasiPage() {
  const { submitReservasi, deleteReservasi, reservations, showNotif, openConfirm } = useApp()
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ name: "", date: "", time: "", guests: "", note: "" })
  const [activeStep, setActiveStep] = useState(0)
  const [hoverSlot, setHoverSlot] = useState(null)

  const inp = {
    border: "1px solid var(--border)", borderRadius: 10,
    padding: "12px 16px", fontSize: 14, width: "100%",
    boxSizing: "border-box", background: "var(--input-bg)",
    color: "var(--text)", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  }

  const steps = [
    { icon: "👤", label: "Data Diri" },
    { icon: "📅", label: "Jadwal" },
    { icon: "✅", label: "Konfirmasi" },
  ]

  function handleSubmit() {
    if (!form.name || !form.date || !form.time || !form.guests) {
      showNotif("Semua field wajib diisi!")
      return
    }
    const rsv = submitReservasi(form)
    setForm({ name: "", date: "", time: "", guests: "", note: "" })
    setActiveStep(0)
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
    <div style={{ animation: "pageIn 0.35s ease" }}>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28, position: "relative" }}>
        <div style={{
          fontSize: 10, letterSpacing: 3, color: "#f59e0b",
          textTransform: "uppercase", marginBottom: 8,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{ width: 20, height: 1, background: "#f59e0b" }} />
          Reservasi Meja
          <div style={{ width: 20, height: 1, background: "#f59e0b" }} />
        </div>
        <h2 style={{
          fontSize: isMobile ? 26 : 34,
          fontWeight: "normal", letterSpacing: 2,
          color: "var(--text)", margin: "0 0 8px",
        }}>
          Pesan <span style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Meja Anda</span>
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
          Reservasi meja untuk acara spesial — cepat, mudah, dan langsung terkonfirmasi.
        </p>
      </div>

      {/* ── Step indicator ───────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center",
        marginBottom: 28, gap: 0,
      }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div
              onClick={() => setActiveStep(i)}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 4, cursor: "pointer",
              }}
            >
              <div style={{
                width: 38, height: 38,
                borderRadius: "50%",
                background: i === activeStep
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : i < activeStep
                  ? "rgba(245,158,11,0.15)"
                  : "var(--card-bg)",
                border: i <= activeStep
                  ? "2px solid #f59e0b"
                  : "2px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
                transition: "all 0.3s",
                boxShadow: i === activeStep ? "0 4px 16px rgba(245,158,11,0.35)" : "none",
              }}>
                {i < activeStep
                  ? <span style={{ color: "#f59e0b", fontSize: 14 }}>✓</span>
                  : <span>{s.icon}</span>
                }
              </div>
              {!isMobile && (
                <span style={{
                  fontSize: 9, letterSpacing: 1,
                  color: i <= activeStep ? "#f59e0b" : "var(--text-muted)",
                  textTransform: "uppercase",
                  transition: "color 0.3s",
                }}>{s.label}</span>
              )}
            </div>

            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 6px 0 6px",
                background: i < activeStep
                  ? "linear-gradient(90deg, #f59e0b, rgba(245,158,11,0.3))"
                  : "var(--border)",
                borderRadius: 2,
                transition: "background 0.4s",
                marginBottom: isMobile ? 0 : 18,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Form card ────────────────────────────────────────────────────── */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 28,
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        position: "relative",
      }}>
        {/* Top accent */}
        <div style={{
          height: 3,
          background: "linear-gradient(90deg, #f59e0b, #c8772a, #f59e0b)",
        }} />

        <div style={{ padding: isMobile ? "20px 16px" : "28px 32px" }}>

          {/* Step 0: Data Diri */}
          {activeStep === 0 && (
            <div style={{ animation: "pageIn 0.3s ease" }}>
              <div style={{
                fontSize: 12, color: "var(--text-muted)",
                marginBottom: 20, letterSpacing: 0.3,
              }}>
                Masukkan informasi pemesan untuk melanjutkan reservasi.
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <label style={{
                    fontSize: 10, letterSpacing: 1.5, color: "#f59e0b",
                    textTransform: "uppercase", display: "block", marginBottom: 6,
                  }}>Nama Pemesan *</label>
                  <input
                    placeholder="Nama lengkap kamu"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={inp}
                  />
                </div>
                <div>
                  <label style={{
                    fontSize: 10, letterSpacing: 1.5, color: "#f59e0b",
                    textTransform: "uppercase", display: "block", marginBottom: 6,
                  }}>Catatan Khusus</label>
                  <input
                    placeholder="Misalnya: meja pojok, anniversary, dll (opsional)"
                    value={form.note}
                    onChange={e => setForm({ ...form, note: e.target.value })}
                    style={inp}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!form.name) { showNotif("Nama wajib diisi!"); return }
                  setActiveStep(1)
                }}
                style={{
                  marginTop: 20,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#1a1a1a", border: "none",
                  padding: "13px 28px", borderRadius: 999,
                  fontSize: 14, fontWeight: "bold",
                  cursor: "pointer", fontFamily: "Georgia, serif",
                  boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,158,11,0.4)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(245,158,11,0.3)" }}
              >
                Lanjut ke Jadwal <span>→</span>
              </button>
            </div>
          )}

          {/* Step 1: Jadwal */}
          {activeStep === 1 && (
            <div style={{ animation: "pageIn 0.3s ease" }}>
              <div style={{
                fontSize: 12, color: "var(--text-muted)",
                marginBottom: 20, letterSpacing: 0.3,
              }}>
                Pilih tanggal, waktu, dan jumlah tamu.
              </div>
              <div style={{ display: "grid", gap: 16 }}>

                {/* Tanggal */}
                <div>
                  <label style={{
                    fontSize: 10, letterSpacing: 1.5, color: "#f59e0b",
                    textTransform: "uppercase", display: "block", marginBottom: 6,
                  }}>Tanggal *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    style={inp}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Time slots */}
                <div>
                  <label style={{
                    fontSize: 10, letterSpacing: 1.5, color: "#f59e0b",
                    textTransform: "uppercase", display: "block", marginBottom: 10,
                  }}>Waktu *</label>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 8,
                  }}>
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setForm({ ...form, time: slot })}
                        onMouseEnter={() => setHoverSlot(slot)}
                        onMouseLeave={() => setHoverSlot(null)}
                        style={{
                          background: form.time === slot
                            ? "linear-gradient(135deg, #f59e0b, #d97706)"
                            : hoverSlot === slot
                            ? "rgba(245,158,11,0.08)"
                            : "var(--input-bg)",
                          color: form.time === slot ? "#1a1a1a" : "var(--text)",
                          border: form.time === slot
                            ? "1.5px solid #f59e0b"
                            : "1px solid var(--border)",
                          borderRadius: 10,
                          padding: "9px 6px",
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: form.time === slot ? "bold" : "normal",
                          transition: "all 0.2s",
                          boxShadow: form.time === slot ? "0 4px 12px rgba(245,158,11,0.3)" : "none",
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {/* Manual time input */}
                  <div style={{ marginTop: 8 }}>
                    <input
                      type="time"
                      value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                      style={{ ...inp, fontSize: 13 }}
                      placeholder="Atau ketik manual"
                    />
                  </div>
                </div>

                {/* Jumlah tamu */}
                <div>
                  <label style={{
                    fontSize: 10, letterSpacing: 1.5, color: "#f59e0b",
                    textTransform: "uppercase", display: "block", marginBottom: 10,
                  }}>Jumlah Tamu *</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {GUEST_OPTIONS.map(n => (
                      <button
                        key={n}
                        onClick={() => setForm({ ...form, guests: String(n) })}
                        style={{
                          width: 42, height: 42,
                          borderRadius: 10,
                          background: form.guests === String(n)
                            ? "linear-gradient(135deg, #f59e0b, #d97706)"
                            : "var(--input-bg)",
                          color: form.guests === String(n) ? "#1a1a1a" : "var(--text)",
                          border: form.guests === String(n)
                            ? "1.5px solid #f59e0b"
                            : "1px solid var(--border)",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: form.guests === String(n) ? "bold" : "normal",
                          transition: "all 0.2s",
                          boxShadow: form.guests === String(n) ? "0 4px 12px rgba(245,158,11,0.3)" : "none",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                    <input
                      type="number"
                      min="1"
                      placeholder="Lainnya"
                      value={GUEST_OPTIONS.includes(Number(form.guests)) ? "" : form.guests}
                      onChange={e => setForm({ ...form, guests: e.target.value })}
                      style={{ ...inp, width: 80, flex: "0 0 auto" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button
                  onClick={() => setActiveStep(0)}
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    padding: "12px 22px",
                    borderRadius: 999, fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#f59e0b"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  ← Kembali
                </button>
                <button
                  onClick={() => {
                    if (!form.date || !form.time || !form.guests) { showNotif("Tanggal, waktu, dan jumlah tamu wajib diisi!"); return }
                    setActiveStep(2)
                  }}
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#1a1a1a", border: "none",
                    padding: "13px", borderRadius: 999,
                    fontSize: 14, fontWeight: "bold",
                    cursor: "pointer", fontFamily: "Georgia, serif",
                    boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,158,11,0.4)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(245,158,11,0.3)" }}
                >
                  Review Reservasi →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Konfirmasi */}
          {activeStep === 2 && (
            <div style={{ animation: "pageIn 0.3s ease" }}>
              <div style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.18)",
                borderRadius: 14,
                padding: "20px",
                marginBottom: 20,
              }}>
                <div style={{
                  fontSize: 10, letterSpacing: 2, color: "#f59e0b",
                  textTransform: "uppercase", marginBottom: 14,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span>✦</span> Ringkasan Reservasi
                </div>
                {[
                  { label: "Nama", value: form.name, icon: "👤" },
                  { label: "Tanggal", value: form.date, icon: "📅" },
                  { label: "Waktu", value: form.time, icon: "🕐" },
                  { label: "Tamu", value: `${form.guests} orang`, icon: "👥" },
                  form.note && { label: "Catatan", value: form.note, icon: "📝" },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "center",
                    padding: "8px 0",
                    borderBottom: i < 3 ? "1px solid rgba(245,158,11,0.1)" : "none",
                  }}>
                    <span style={{ fontSize: 16 }}>{row.icon}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 12, width: 60 }}>{row.label}</span>
                    <span style={{ color: "var(--text)", fontSize: 13, fontWeight: "500" }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setActiveStep(1)}
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    padding: "12px 22px",
                    borderRadius: 999, fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#f59e0b"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  ← Edit
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#1a1a1a", border: "none",
                    padding: "14px", borderRadius: 999,
                    fontSize: 15, fontWeight: "bold",
                    cursor: "pointer", fontFamily: "Georgia, serif",
                    boxShadow: "0 4px 16px rgba(245,158,11,0.35)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(245,158,11,0.5)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(245,158,11,0.35)" }}
                >
                  📅 Konfirmasi Reservasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Daftar reservasi ─────────────────────────────────────────────── */}
      {reservations.length > 0 && (
        <div>
          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4))" }} />
            <span style={{ fontSize: 9, letterSpacing: 2.5, color: "rgba(245,158,11,0.7)", textTransform: "uppercase" }}>
              Reservasi Aktif
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(245,158,11,0.4), transparent)" }} />
          </div>

          {reservations.map((r, idx) => {
            const color = STATUS_COLOR[r.status] || "#f59e0b"
            return (
              <div key={r.kode} style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 12,
                transition: "box-shadow 0.2s",
                animation: `floatUp 0.4s ease ${idx * 0.08}s both`,
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                {/* Accent top bar */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />

                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 15, color: "var(--text)", marginBottom: 2 }}>
                        {r.name}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: 11 }}>
                        📅 {r.date} · 🕐 {r.time} · 👥 {r.guests} tamu
                      </div>
                    </div>
                    <span style={{
                      background: color + "20",
                      color,
                      border: `1px solid ${color}44`,
                      padding: "4px 12px", borderRadius: 999,
                      fontSize: 10, fontWeight: "bold", letterSpacing: 0.5,
                      flexShrink: 0,
                    }}>{r.status || "Dikonfirmasi"}</span>
                  </div>

                  {r.note && (
                    <div style={{
                      background: "rgba(245,158,11,0.06)",
                      border: "1px solid rgba(245,158,11,0.15)",
                      borderRadius: 8, padding: "7px 10px",
                      fontSize: 11, color: "var(--text-muted)",
                      marginBottom: 10,
                    }}>
                      📝 {r.note}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontFamily: "monospace",
                      fontSize: 11, color: "var(--text-muted)",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 6, padding: "3px 8px",
                    }}>{r.kode}</span>
                    <button
                      onClick={() => handleDelete(r)}
                      style={{
                        background: "none", color: "#ef4444",
                        border: "1px solid #ef444444",
                        padding: "5px 14px", borderRadius: 999,
                        fontSize: 11, cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#ef44440f"; e.currentTarget.style.borderColor = "#ef4444" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#ef444444" }}
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {reservations.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "32px 0 8px",
          color: "var(--text-muted)",
          fontSize: 13,
        }}>
          <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.5 }}>📅</div>
          Belum ada reservasi. Buat reservasi pertamamu!
        </div>
      )}
    </div>
  )
}
