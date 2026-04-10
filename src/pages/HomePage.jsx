import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "../hooks/useIsMobile"
import SectionDivider from "../components/SectionDivider"

/* ── Animated counter ───────────────────────────────────────────────────── */
function AnimCounter({ target, suffix = "" }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const num = parseInt(target)
    let start = null
    const dur = 1200
    function step(ts) {
      if (!start) start = ts
      const prog = Math.min((ts - start) / dur, 1)
      const ease = 1 - Math.pow(1 - prog, 3)
      setVal(Math.round(num * ease))
      if (prog < 1) ref.current = requestAnimationFrame(step)
    }
    ref.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(ref.current)
  }, [target])
  return <>{val}{suffix}</>
}

/* ── Testimonial card ───────────────────────────────────────────────────── */
function TestimonialCard({ name, text, rating, delay = 0 }) {
  const [vis, setVis] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect() }
    }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "18px 20px",
        position: "relative",
        overflow: "hidden",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {/* Quote mark dekorasi */}
      <div style={{
        position: "absolute",
        top: -4, right: 14,
        fontSize: 64,
        color: "rgba(245,158,11,0.07)",
        fontFamily: "Georgia, serif",
        lineHeight: 1,
        pointerEvents: "none",
        userSelect: "none",
      }}>"</div>

      {/* Stars */}
      <div style={{ color: "#f59e0b", fontSize: 12, marginBottom: 8, letterSpacing: 2 }}>
        {"★".repeat(rating)}
      </div>

      <p style={{
        color: "var(--text)",
        fontSize: 13,
        lineHeight: 1.65,
        marginBottom: 12,
        fontStyle: "italic",
        margin: "0 0 12px",
      }}>
        "{text}"
      </p>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        {/* Avatar placeholder */}
        <div style={{
          width: 28, height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #c8772a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, color: "#1a1a1a", fontWeight: "bold",
          flexShrink: 0,
        }}>
          {name.charAt(0)}
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: 11 }}>— {name}</span>
      </div>
    </div>
  )
}

/* ── Feature card ───────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, accent, delay = 0, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [vis, setVis] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${hovered ? accent + "55" : "var(--border)"}`,
        borderRadius: 20,
        padding: "22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.25s",
        transform: vis
          ? (hovered ? "translateY(-5px)" : "translateY(0)")
          : "translateY(18px)",
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,0.1), 0 0 0 1px ${accent}22`
          : "none",
        opacity: vis ? 1 : 0,
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        transitionDelay: vis ? "0ms" : `${delay}ms`,
        transitionProperty: "opacity, transform, box-shadow, border-color",
        transitionDuration: "0.45s, 0.3s, 0.3s, 0.25s",
        transitionTimingFunction: "ease",
      }}
    >
      {/* Glow di hover */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 30% 30%, ${accent}0a, transparent 70%)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.35s",
        pointerEvents: "none",
      }} />

      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: hovered ? 0.8 : 0.3,
        transition: "opacity 0.3s",
      }} />

      {/* Icon */}
      <div style={{
        width: 52, height: 52,
        borderRadius: 14,
        background: accent + "18",
        border: `1.5px solid ${accent}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26,
        marginBottom: 14,
        transition: "transform 0.3s, background 0.3s",
        transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
      }}>
        {icon}
      </div>

      <div style={{ fontWeight: "bold", fontSize: 15, color: "var(--text)", marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.65 }}>
        {desc}
      </div>

      {onClick && (
        <div style={{
          marginTop: 14,
          fontSize: 11,
          color: accent,
          letterSpacing: 0.5,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-6px)",
          transition: "opacity 0.25s, transform 0.25s",
        }}>
          Lihat selengkapnya →
        </div>
      )}
    </div>
  )
}

/* ── Main HomePage ──────────────────────────────────────────────────────── */
export default function HomePage({ setPage }) {
  const isMobile = useIsMobile()
  const heroRef  = useRef(null)
  const [heroVisible, setHeroVisible] = useState(false)

  // Parallax on scroll
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.15}px)`
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const features = [
    {
      icon: "🍳",
      title: "Menu Lengkap",
      desc: "Berbagai pilihan masakan nusantara otentik yang dimasak dengan cinta dan bumbu pilihan.",
      accent: "#f59e0b",
      page: "menu",
    },
    {
      icon: "📅",
      title: "Reservasi Mudah",
      desc: "Pesan meja untuk acara spesialmu — cepat, mudah, dan langsung terkonfirmasi.",
      accent: "#c8772a",
      page: "reservasi",
    },
    {
      icon: "🔍",
      title: "Lacak Pesanan",
      desc: "Pantau status pesananmu secara real-time langsung dari genggamanmu kapan saja.",
      accent: "#10b981",
      page: "status",
    },
  ]

  const testimonials = [
    { name: "Rina S.",  text: "Makanannya enak banget, pesan juga gampang!", rating: 5 },
    { name: "Budi P.",  text: "Reservasinya cepat dikonfirmasi, pelayanan ramah.", rating: 5 },
    { name: "Dewi A.",  text: "Nasi gorengnya juara! Pasti balik lagi.", rating: 5 },
  ]

  const stats = [
    { val: "30", suffix: "+", label: "Menu Pilihan" },
    { val: "500", suffix: "+", label: "Pelanggan" },
    { val: "4", suffix: ".9★", label: "Rating" },
  ]

  return (
    <div style={{ animation: "pageIn 0.35s ease" }}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        borderRadius: isMobile ? 20 : 28,
        overflow: "hidden",
        marginBottom: isMobile ? 28 : 40,
        background: "linear-gradient(135deg, #0f0f0f 0%, #1e1005 40%, #2d1f0e 70%, #0f0f0f 100%)",
        minHeight: isMobile ? 340 : 440,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: isMobile ? "56px 24px 48px" : "80px 56px 72px",
      }}>

        {/* Dot texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.035,
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          pointerEvents: "none",
        }} />

        {/* Glow orbs */}
        <div style={{
          position: "absolute", width: 360, height: 360,
          borderRadius: "50%", background: "#f59e0b",
          opacity: 0.06, filter: "blur(90px)",
          top: -80, right: -80, pointerEvents: "none",
          animation: "fadeIn 1.5s ease",
        }} />
        <div style={{
          position: "absolute", width: 240, height: 240,
          borderRadius: "50%", background: "#c8772a",
          opacity: 0.09, filter: "blur(70px)",
          bottom: -50, left: -50, pointerEvents: "none",
          animation: "fadeIn 1.8s ease",
        }} />
        <div style={{
          position: "absolute", width: 180, height: 180,
          borderRadius: "50%", background: "#f59e0b",
          opacity: 0.04, filter: "blur(50px)",
          bottom: 40, right: 80, pointerEvents: "none",
        }} />

        {/* Ornamen sudut */}
        <div style={{
          position: "absolute", top: 18, left: 20,
          fontSize: 16, color: "rgba(245,158,11,0.2)",
          letterSpacing: 4, pointerEvents: "none",
        }}>✦ ✦ ✦</div>
        <div style={{
          position: "absolute", bottom: 18, right: 20,
          fontSize: 16, color: "rgba(245,158,11,0.2)",
          letterSpacing: 4, pointerEvents: "none",
        }}>✦ ✦ ✦</div>

        {/* Badge */}
        <div
          ref={heroRef}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.28)",
            borderRadius: 999, padding: "6px 16px",
            marginBottom: 22, fontSize: 10,
            color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
          <span style={{ fontSize: 8 }}>✦</span>
          Masakan Nusantara Otentik
          <span style={{ fontSize: 8 }}>✦</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: isMobile ? 52 : 76,
          fontWeight: "normal",
          margin: "0 0 0",
          letterSpacing: 7,
          color: "#fff",
          lineHeight: 1.08,
          fontFamily: "Georgia, serif",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s",
        }}>
          mari<span style={{
            background: "linear-gradient(135deg, #f59e0b, #fde68a, #d97706)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>kumur</span>
        </h1>

        {/* Ornamen garis */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          margin: "14px auto 18px",
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 0.5s ease 0.25s",
        }}>
          <div style={{ width: 32, height: 1, background: "rgba(245,158,11,0.3)" }} />
          <span style={{ color: "rgba(245,158,11,0.5)", fontSize: 10 }}>✦</span>
          <div style={{ width: 48, height: 1.5, background: "linear-gradient(90deg, rgba(245,158,11,0.5), #f59e0b, rgba(245,158,11,0.5))" }} />
          <span style={{ color: "rgba(245,158,11,0.5)", fontSize: 10 }}>✦</span>
          <div style={{ width: 32, height: 1, background: "rgba(245,158,11,0.3)" }} />
        </div>

        <p style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: isMobile ? 13.5 : 15.5,
          margin: "0 0 34px",
          maxWidth: 400,
          lineHeight: 1.75,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.65s ease 0.3s, transform 0.65s ease 0.3s",
        }}>
          Pesan makanan &amp; reservasi meja dengan mudah.<br />
          Nikmati cita rasa nusantara di meja Anda.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: "flex", gap: 12, justifyContent: "center",
          flexWrap: "wrap",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.65s ease 0.4s, transform 0.65s ease 0.4s",
        }}>
          <button
            onClick={() => setPage("menu")}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)"
              e.currentTarget.style.boxShadow = "0 10px 32px rgba(245,158,11,0.55)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,158,11,0.35)"
            }}
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "#1a1a1a", border: "none",
              padding: isMobile ? "13px 28px" : "14px 38px",
              borderRadius: 999, fontSize: isMobile ? 13.5 : 14.5,
              cursor: "pointer", fontFamily: "Georgia, serif",
              fontWeight: "bold",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
              display: "flex", alignItems: "center", gap: 7,
            }}>
            🍽 Lihat Menu
          </button>
          <button
            onClick={() => setPage("reservasi")}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(245,158,11,0.1)"
              e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)"
              e.currentTarget.style.transform = "translateY(-3px)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"
              e.currentTarget.style.transform = "translateY(0)"
            }}
            style={{
              background: "transparent", color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.3)",
              padding: isMobile ? "13px 28px" : "14px 38px",
              borderRadius: 999, fontSize: isMobile ? 13.5 : 14.5,
              cursor: "pointer", fontFamily: "Georgia, serif",
              transition: "all 0.22s",
              display: "flex", alignItems: "center", gap: 7,
            }}>
            📅 Reservasi Meja
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: isMobile ? 28 : 56,
          marginTop: 44, paddingTop: 28,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 0.8s ease 0.55s",
        }}>
          {stats.map(({ val, suffix, label }, i) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: isMobile ? 20 : 24,
                fontWeight: "bold",
                color: "#f59e0b",
                fontFamily: "Georgia, serif",
                animation: heroVisible ? `countUp 0.5s ease ${i * 0.12 + 0.6}s both` : "none",
              }}>
                {heroVisible ? <AnimCounter target={val} suffix={suffix} /> : "—"}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3, letterSpacing: 0.5 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURE CARDS ──────────────────────────────────────────────── */}
      <SectionDivider label="Fitur Unggulan" />
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
        gap: 14,
        marginBottom: isMobile ? 32 : 44,
      }}>
        {features.map(({ icon, title, desc, accent, page }, i) => (
          <FeatureCard
            key={title}
            icon={icon}
            title={title}
            desc={desc}
            accent={accent}
            delay={i * 100}
            onClick={() => setPage(page)}
          />
        ))}
      </div>

      {/* ── PROMO BANNER ───────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #141414 0%, #2a1508 50%, #1a1a1a 100%)",
        borderRadius: 20,
        padding: isMobile ? "22px 20px" : "30px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: isMobile ? 32 : 44,
        border: "1px solid rgba(245,158,11,0.18)",
        position: "relative",
        overflow: "hidden",
        animation: "borderGlow 3s ease infinite",
      }}>
        {/* Dekorasi */}
        <div style={{
          position: "absolute", right: -30, top: -30,
          width: 160, height: 160, borderRadius: "50%",
          background: "#f59e0b", opacity: 0.05, filter: "blur(40px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", left: -20, bottom: -20,
          width: 120, height: 120, borderRadius: "50%",
          background: "#c8772a", opacity: 0.06, filter: "blur(30px)",
          pointerEvents: "none",
        }} />
        {/* Ornamen kiri */}
        <div style={{
          position: "absolute", left: 16, top: "50%",
          transform: "translateY(-50%)",
          fontSize: 48, opacity: 0.04, pointerEvents: "none",
        }}>🎉</div>

        <div>
          <div style={{
            fontSize: 9, letterSpacing: 2.5, color: "#f59e0b",
            textTransform: "uppercase", marginBottom: 5,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>✦</span> Promo Hari Ini
          </div>
          <div style={{
            fontSize: isMobile ? 16 : 21,
            color: "#fff", fontFamily: "Georgia, serif", marginBottom: 5,
            lineHeight: 1.3,
          }}>
            Gratis Es Teh untuk setiap pesanan<br />di atas{" "}
            <span style={{ color: "#f59e0b" }}>Rp 50.000</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 0.3 }}>
            Berlaku setiap hari · Dine-in only
          </div>
        </div>
        <button
          onClick={() => setPage("menu")}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.03)"
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,158,11,0.5)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0) scale(1)"
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(245,158,11,0.3)"
          }}
          style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#1a1a1a", border: "none",
            padding: "12px 24px",
            borderRadius: 999, fontSize: 13,
            fontWeight: "bold", cursor: "pointer",
            flexShrink: 0,
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
          }}>
          Pesan Sekarang →
        </button>
      </div>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <SectionDivider label="Kata Mereka" />
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
        gap: 12,
        marginBottom: 8,
      }}>
        {testimonials.map(({ name, text, rating }, i) => (
          <TestimonialCard
            key={name}
            name={name}
            text={text}
            rating={rating}
            delay={i * 120}
          />
        ))}
      </div>
    </div>
  )
}
