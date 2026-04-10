import { useEffect, useRef } from "react"

/**
 * FloatingParticles v2 — canvas partikel ambient bertema nusantara/kuliner.
 * Fitur baru: multi-layer (simbol + cincin + titik), gradasi warna, opacity pulse.
 */
export default function FloatingParticles({ count = 26 }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const symbols  = ["✦", "❋", "✿", "❂", "⋆", "✺", "◈", "❖", "✵", "⟡"]
    const dots     = ["•", "·", "∘"]
    const colors   = ["#f59e0b", "#c8772a", "#fde68a", "#d97706", "#f0c060"]

    let W = 0, H = 0
    const layers = { symbols: [], rings: [], dots: [] }

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function makeSymbol() {
      return {
        type: "symbol",
        x: Math.random() * W,
        y: Math.random() * H,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        size: 9 + Math.random() * 13,
        opacity: 0.03 + Math.random() * 0.07,
        baseOpacity: 0,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.08 - Math.random() * 0.16,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.003 + Math.random() * 0.007,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.012,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
      }
    }

    function makeRing() {
      return {
        type: "ring",
        x: Math.random() * W,
        y: Math.random() * H,
        r: 12 + Math.random() * 28,
        opacity: 0.015 + Math.random() * 0.03,
        vy: -0.04 - Math.random() * 0.08,
        vx: (Math.random() - 0.5) * 0.06,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.008,
        color: colors[Math.floor(Math.random() * 2)],
        lineWidth: 0.5 + Math.random() * 0.8,
      }
    }

    function makeDot() {
      return {
        type: "dot",
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1 + Math.random() * 2.5,
        opacity: 0.04 + Math.random() * 0.1,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.12,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.004 + Math.random() * 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
      }
    }

    function init() {
      resize()
      layers.symbols = []
      layers.rings   = []
      layers.dots    = []

      const symCount  = Math.floor(count * 0.5)
      const ringCount = Math.floor(count * 0.2)
      const dotCount  = Math.floor(count * 0.3)

      for (let i = 0; i < symCount;  i++) layers.symbols.push(makeSymbol())
      for (let i = 0; i < ringCount; i++) layers.rings.push(makeRing())
      for (let i = 0; i < dotCount;  i++) layers.dots.push(makeDot())
    }

    function drawSymbol(p, t) {
      const pulse = Math.sin(p.pulsePhase + t * p.pulseSpeed) * 0.5 + 0.5
      const op = p.opacity * (0.7 + pulse * 0.3)
      ctx.save()
      ctx.globalAlpha = op
      ctx.fillStyle = p.color
      ctx.font = `${p.size}px serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillText(p.symbol, 0, 0)
      ctx.restore()

      p.drift    += p.driftSpeed
      p.rotation += p.rotSpeed
      p.x += p.vx + Math.sin(p.drift) * 0.2
      p.y += p.vy + Math.cos(p.drift * 0.7) * 0.05

      if (p.y < -30) p.y = H + 30
      if (p.x < -30) p.x = W + 30
      if (p.x > W + 30) p.x = -30
    }

    function drawRing(p, t) {
      const pulse = Math.sin(p.pulsePhase + t * p.pulseSpeed) * 0.5 + 0.5
      ctx.save()
      ctx.globalAlpha = p.opacity * (0.6 + pulse * 0.4)
      ctx.strokeStyle = p.color
      ctx.lineWidth = p.lineWidth
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      p.x += p.vx
      p.y += p.vy

      if (p.y < -p.r * 2) p.y = H + p.r * 2
      if (p.x < -p.r * 2) p.x = W + p.r * 2
      if (p.x > W + p.r * 2) p.x = -p.r * 2
    }

    function drawDot(p, t) {
      const pulse = Math.sin(p.pulsePhase + t * p.pulseSpeed) * 0.5 + 0.5
      ctx.save()
      ctx.globalAlpha = p.opacity * (0.5 + pulse * 0.5)
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      p.drift += p.driftSpeed
      p.x += p.vx + Math.sin(p.drift) * 0.12
      p.y += p.vy

      if (p.y < -10) p.y = H + 10
      if (p.x < -10) p.x = W + 10
      if (p.x > W + 10) p.x = -10
    }

    let t = 0
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t++

      for (const p of layers.rings)   drawRing(p, t)
      for (const p of layers.dots)    drawDot(p, t)
      for (const p of layers.symbols) drawSymbol(p, t)

      animRef.current = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    init()
    draw()

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(animRef.current)
      else draw()
    }
    document.addEventListener("visibilitychange", onVis)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  )
}
