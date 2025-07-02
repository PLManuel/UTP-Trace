const ExportGraduatesButton = () => {
  const handleExport = async () => {
    try {
      const response = await fetch("/api/graduates/exportGraduates")

      if (!response.ok) {
        const error = await response.json()
        alert("Error al exportar: " + error.error)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = "egresados.xlsx" // Nombre del archivo
      document.body.appendChild(link)
      link.click()

      // Limpieza
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al exportar el archivo:", error)
      alert("Error inesperado al descargar el archivo.")
    }
  }

  return (
    <button className="flex items-center text-green-600 cursor-pointer" onClick={handleExport}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
        <path d="M4 15l4 6" />
        <path d="M4 21l4 -6" />
        <path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" />
        <path d="M11 15v6h3" />
      </svg>
      Exportar
    </button>
  )
}

export default ExportGraduatesButton
