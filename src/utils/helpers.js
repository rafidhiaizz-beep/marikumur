export function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID")
}

export function generateKode(prefix = "MK") {
  return prefix + Date.now().toString().slice(-5)
}

export function exportToCSV(orders) {
  const header = ["Kode", "Nama", "Meja", "Items", "Total", "Status", "Waktu"]
  const rows = orders.map(o => [
    o.kode,
    o.name,
    o.table,
    o.items.map(i => `${i.name} x${i.qty}`).join(" | "),
    o.total,
    o.status,
    o.time,
  ])
  const csv = [header, ...rows].map(r => r.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `pesanan-marikumur-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
