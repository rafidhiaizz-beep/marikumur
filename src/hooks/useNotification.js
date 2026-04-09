import { useState, useCallback } from "react"

export function useNotification() {
  const [notification, setNotification] = useState("")

  const showNotif = useCallback((msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 2500)
  }, [])

  return { notification, showNotif }
}
