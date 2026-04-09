import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { DEFAULT_MENU } from "../data/menuData"
import { generateKode } from "../utils/helpers"
import { useNotification } from "../hooks/useNotification"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // ── Theme ──────────────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("mk-dark") === "true")
  const toggleDark = () => setDarkMode(prev => {
    localStorage.setItem("mk-dark", String(!prev))
    return !prev
  })

  // ── Menu (persisted to localStorage) ──────────────────────────────────────
  const [menuData, setMenuData] = useState(() => {
    try {
      const stored = localStorage.getItem("mk-menu")
      return stored ? JSON.parse(stored) : DEFAULT_MENU
    } catch { return DEFAULT_MENU }
  })
  useEffect(() => localStorage.setItem("mk-menu", JSON.stringify(menuData)), [menuData])

  const addMenuItem = useCallback((item) => {
    const newItem = { ...item, id: Date.now(), price: Number(item.price) }
    setMenuData(prev => [...prev, newItem])
  }, [])

  const updateMenuItem = useCallback((id, updates) => {
    setMenuData(prev => prev.map(m => m.id === id ? { ...m, ...updates, price: Number(updates.price) } : m))
  }, [])

  const deleteMenuItem = useCallback((id) => {
    setMenuData(prev => prev.filter(m => m.id !== id))
  }, [])

  // ── Cart ───────────────────────────────────────────────────────────────────
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const totalCart = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id)
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...item, qty: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === id)
      if (ex && ex.qty > 1) return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
      return prev.filter(i => i.id !== id)
    })
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  // ── Orders ─────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([])

  const submitOrder = useCallback((form) => {
    const kode = generateKode("MK")
    const order = {
      kode,
      name: form.name,
      table: form.table,
      note: form.note,
      items: [...cart],
      total: totalCart,
      status: "Menunggu",
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    }
    setOrders(prev => [...prev, order])
    clearCart()
    return order
  }, [cart, totalCart, clearCart])

  const updateOrderStatus = useCallback((kode, status) => {
    setOrders(prev => prev.map(o => o.kode === kode ? { ...o, status } : o))
  }, [])

  const deleteOrder = useCallback((kode) => {
    setOrders(prev => prev.filter(o => o.kode !== kode))
  }, [])

  // ── Reservations ───────────────────────────────────────────────────────────
  const [reservations, setReservations] = useState([])

  const submitReservasi = useCallback((form) => {
    const kode = generateKode("RV")
    const rsv = { kode, ...form, status: "Terkonfirmasi" }
    setReservations(prev => [...prev, rsv])
    return rsv
  }, [])

  const deleteReservasi = useCallback((kode) => {
    setReservations(prev => prev.filter(r => r.kode !== kode))
  }, [])

  // ── Admin ──────────────────────────────────────────────────────────────────
  const [isAdmin, setIsAdmin] = useState(false)
  const logoutAdmin = () => setIsAdmin(false)

  // ── Global Confirm Dialog ──────────────────────────────────────────────────
  const [confirmDialog, setConfirmDialog] = useState(null) // { title, message }
  const confirmResolveRef = useRef(null)

  const openConfirm = useCallback(({ title, message }) => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve
      setConfirmDialog({ title, message })
    })
  }, [])

  const resolveConfirm = useCallback((result) => {
    setConfirmDialog(null)
    confirmResolveRef.current?.(result)
    confirmResolveRef.current = null
  }, [])

  // ── Notification ───────────────────────────────────────────────────────────
  const { notification, showNotif } = useNotification()

  return (
    <AppContext.Provider value={{
      darkMode, toggleDark,
      menuData, addMenuItem, updateMenuItem, deleteMenuItem,
      cart, cartOpen, setCartOpen, totalCart, cartCount, addToCart, removeFromCart, clearCart,
      orders, submitOrder, updateOrderStatus, deleteOrder,
      reservations, submitReservasi, deleteReservasi,
      isAdmin, setIsAdmin, logoutAdmin,
      confirmDialog, openConfirm, resolveConfirm,
      notification, showNotif,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp harus dipakai di dalam AppProvider")
  return ctx
}
