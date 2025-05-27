import { useRef, useState } from "react"

interface ExperienciaLaboral {
  id: number
  empresa: string
  cargo: string
  fechaIngreso: string
  fechaSalida: string | null
}

interface GraduateData {
  id: number
  nombre: string
  apellido: string
  email: string
  carrera: string
  fechaNacimiento: string
  fechaIngreso: string
  fechaEgreso: string
  ponderado: number
  idExperienciaLaboral: ExperienciaLaboral[]
  historialActualizacion: any[]
}

export default function UpdateGraduates({
  idGraduate,
}: {
  idGraduate: number
}) {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [graduate, setGraduate] = useState<GraduateData | null>(null)
  const [form, setForm] = useState<Partial<GraduateData>>({})
  const [descripcion, setDescripcion] = useState("")
  const [loading, setLoading] = useState(false)

  const openModal = () => {
    modalRef.current?.showModal()
    fetchGraduate()
  }

  const fetchGraduate = async () => {
    try {
      const res = await fetch(`/api/graduates/getGraduate?id=${idGraduate}`)
      const result = await res.json()
      const parsed =
        typeof result.error === "string" ? JSON.parse(result.error) : result

      setGraduate(parsed)
      setForm(parsed)
      setDescripcion("")
    } catch (err) {
      alert("Error al cargar los datos del egresado")
    }
  }

  const handleChange = (field: keyof GraduateData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleExpChange = (
    index: number,
    field: keyof ExperienciaLaboral,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      idExperienciaLaboral: prev.idExperienciaLaboral?.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.id) return

    setLoading(true)

    const payload = {
      ...form,
      historialActualizaciones: {
        idUsuario: 1,
        descripción: descripcion || "Modificación sin detalle",
      },
    }

    try {
      const res = await fetch("/api/graduates/updateGraduates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Error en la actualización")

      alert("Egresado actualizado correctamente")
      modalRef.current?.close()
    } catch {
      alert("Error al actualizar egresado")
    } finally {
      setLoading(false)
      window.location.reload()
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Actualizar
      </button>

      <dialog
        ref={modalRef}
        className="rounded-md w-full max-w-2xl p-0 shadow-xl mx-auto"
      >
        <form method="dialog" className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Actualizar Egresado</h2>
            <button type="button" onClick={() => modalRef.current?.close()}>
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <fieldset>
              <label className="text-sm">Nombre</label>
              <input
                required
                value={form.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Nombre"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </fieldset>
            <fieldset>
              <label className="text-sm">Apellido</label>
              <input
                required
                value={form.apellido || ""}
                onChange={(e) => handleChange("apellido", e.target.value)}
                placeholder="Apellido"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </fieldset>
            <fieldset>
              <label className="text-sm">Correo</label>
              <input
                required
                type="email"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full col-span-2"
              />
            </fieldset>
            <fieldset>
              <label className="text-sm">Carrera</label>
              <input
                required
                value={form.carrera || ""}
                onChange={(e) => handleChange("carrera", e.target.value)}
                placeholder="Carrera"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full col-span-2"
              />
            </fieldset>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <fieldset>
              <label className="text-sm">Fecha de nacimiento</label>
              <input
                required
                type="date"
                value={form.fechaNacimiento?.split("T")[0] || ""}
                onChange={(e) =>
                  handleChange("fechaNacimiento", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </fieldset>
            <fieldset>
              <label className="text-sm">Fecha de ingreso</label>
              <input
                required
                type="date"
                value={form.fechaIngreso?.split("T")[0] || ""}
                onChange={(e) => handleChange("fechaIngreso", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </fieldset>
            <fieldset>
              <label className="text-sm">Fecha de egreso</label>
              <input
                required
                type="date"
                value={form.fechaEgreso?.split("T")[0] || ""}
                onChange={(e) => handleChange("fechaEgreso", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </fieldset>
          </div>

          <fieldset>
            <label className="text-sm">Ponderado</label>
            <input
              required
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={form.ponderado || ""}
              onChange={(e) =>
                handleChange("ponderado", parseFloat(e.target.value))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </fieldset>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-medium">Experiencia Laboral</label>
            </div>
            {form.idExperienciaLaboral?.map((exp, index) => (
              <div key={exp.id} className="border p-4 rounded space-y-2">
                <input
                  type="text"
                  value={exp.empresa}
                  onChange={(e) =>
                    handleExpChange(index, "empresa", e.target.value)
                  }
                  placeholder="Empresa"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                  type="text"
                  value={exp.cargo}
                  onChange={(e) =>
                    handleExpChange(index, "cargo", e.target.value)
                  }
                  placeholder="Cargo"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                  type="date"
                  value={exp.fechaIngreso?.split("T")[0]}
                  onChange={(e) =>
                    handleExpChange(index, "fechaIngreso", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                  type="date"
                  value={exp.fechaSalida?.split("T")[0] || ""}
                  onChange={(e) =>
                    handleExpChange(index, "fechaSalida", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm block mb-1">
              Descripción de modificación *
            </label>
            <textarea
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe brevemente los cambios realizados"
            />
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={() => modalRef.current?.close()}
              className="px-4 py-2 rounded-md transition bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md transition bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
