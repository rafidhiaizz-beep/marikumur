import { useState, useEffect } from "react"
import { AppProvider, useApp } from "./context/AppContext"
import { useIsMobile } from "./hooks/useIsMobile"

import Header              from "./components/Header"
import BottomNav           from "./components/BottomNav"
import Notification        from "./components/Notification"
import ConfirmDialog       from "./components/ConfirmDialog"
import FloatingParticles   from "./components/FloatingParticles"
import ScrollToTopButton   from "./components/ScrollToTopButton"

import HomePage            from "./pages/HomePage"
import MenuPage            from "./pages/MenuPage"
import ReservasiPage       from "./pages/ReservasiPage"
import StatusPage          from "./pages/StatusPage"
import AdminLoginPage      from "./pages/AdminLoginPage"
import AdminPage           from "./pages/AdminPage"

// ── Inner app (needs context) ─────────────────────────────────────────────
function AppInner() {
  const { notification, darkMode } = useApp()
  const isMobile = useIsMobile()
  const [page, setPage] = useState("home")

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page])

  // Sync dark mode → <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const pages = {
    home:       <HomePage setPage={setPage} />,
    menu:       <MenuPage setPage={setPage} />,
    reservasi:  <ReservasiPage />,
    status:     <StatusPage />,
    adminlogin: <AdminLoginPage setPage={setPage} />,
    admin:      <AdminPage setPage={setPage} />,
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      {/* Floating ambient particles — dekorasi latar belakang */}
      <FloatingParticles count={22} />

      {/* Global overlays */}
      <Notification message={notification} />
      <ConfirmDialog />

      <Header page={page} setPage={setPage} />

      <main style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: isMobile ? "20px 14px 90px" : "32px 24px",
        position: "relative",
        zIndex: 1,
      }}>
        {pages[page] ?? <HomePage setPage={setPage} />}
      </main>

      {isMobile && <BottomNav page={page} setPage={setPage} />}
      <ScrollToTopButton />
    </div>
  )
}

// ── Root export ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
