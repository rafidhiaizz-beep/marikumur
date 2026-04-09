export default function Notification({ message }) {
  if (!message) return null
  return (
    <div style={{
      position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
      background: "#1a1a1a", color: "#fff", padding: "10px 20px",
      borderRadius: 999, fontSize: 13, zIndex: 9999,
      whiteSpace: "nowrap", maxWidth: "90vw",
      overflow: "hidden", textOverflow: "ellipsis",
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      animation: "fadeIn 0.2s ease",
    }}>
      {message}
    </div>
  )
}
