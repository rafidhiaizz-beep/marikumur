import { useEffect, useState } from "react"

/**
 * ScrollToTopButton — tombol kembali ke atas yang muncul saat scroll
 * Bertema nusantara premium, konsisten dengan brand marikumur
 */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Kembali ke atas"
      style={{
        position: "fixed",
        bottom: 84,
        right: 18,
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: hovered
          ? "linear-gradient(135deg, #f59e0b, #d97706)"
          : "rgba(18, 12, 6, 0.92)",
        border: `1.5px solid ${hovered ? "#f59e0b" : "rgba(245,158,11,0.35)"}`,
        color: hovered ? "#1a1a1a" : "#f59e0b",
        cursor: "pointer",
        zIndex: 95,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        boxShadow: hovered
          ? "0 8px 24px rgba(245,158,11,0.45)"
          : "0 4px 16px rgba(0,0,0,0.3)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hovered ? "translateY(-3px) scale(1.08)" : "translateY(0) scale(1)",
        animation: "badge-pop 0.35s ease both",
      }}
    >
      ↑
    </button>
  )
}
