import { useState, useEffect } from "react"

export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint)

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener("resize", handle)
    return () => window.removeEventListener("resize", handle)
  }, [breakpoint])

  return isMobile
}
