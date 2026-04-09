import { useState } from "react"
import { useApp } from "../context/AppContext"
import { ADMIN_PASSWORD } from "../data/menuData"

export default function AdminLoginPage({ setPage }) {
  const { setIsAdmin, showNotif } = useApp()
  const [pass, setPass] = useState("")

  function login() {
    if (pass === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setPage("admin")
    } else {
      showNotif("Password salah!")
      setPass("")
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "48px auto", animation: "pageIn 0.25s ease" }}>
      <h2 style={{ fontSize: 22, fontWeight: "normal", marginBottom: 20, textAlign: "center", color: "var(--text)" }}>Login Admin</h2>
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: 12, padding: 24, display: "grid", gap: 10,
      }}>
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          style={{
            border: "1px solid var(--border)", borderRadius: 8,
            padding: "11px 14px", fontSize: 14, width: "100%",
            boxSizing: "border-box", background: "var(--input-bg)",
            color: "var(--text)", outline: "none",
          }}
        />
        <button onClick={login} style={{
          background: "#1a1a1a", color: "#fff", border: "none",
          padding: "13px", borderRadius: 8, fontSize: 15,
          cursor: "pointer", fontFamily: "Georgia, serif",
        }}>Masuk</button>
        <p style={{ color: "#aaa", fontSize: 12, textAlign: "center", margin: 0 }}>Password demo: admin123</p>
      </div>
    </div>
  )
}
