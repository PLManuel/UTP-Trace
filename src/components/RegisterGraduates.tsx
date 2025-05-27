import { useRef, useState } from "react"

interface ExperienciaLaboral {
  empresa: string
  cargo: string
  fechaIngreso: string
  fechaSalida: string | null
}

interface FormData {
  nombre: string
  apellido: string
  email: string
  carrera: string
  fechaNacimiento: string
  fechaIngreso: string
  fechaEgreso: string
  ponderado: number
  experienciaLaboralDTO: ExperienciaLaboral[]
}

export default function RegisterGraduates() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    carrera: "",
    fechaNacimiento: "",
    fechaIngreso: "",
    fechaEgreso: "",
    ponderado: 0,
    experienciaLaboralDTO: [],
  })

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addExperiencia = () => {
    setFormData((prev) => ({
      ...prev,
      experienciaLaboralDTO: [
        ...prev.experienciaLaboralDTO,
        { empresa: "", cargo: "", fechaIngreso: "", fechaSalida: null },
      ],
    }))
  }

  const removeExperiencia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experienciaLaboralDTO: prev.experienciaLaboralDTO.filter(
        (_, i) => i !== index
      ),
    }))
  }

  const updateExperiencia = (
    index: number,
    field: keyof ExperienciaLaboral,
    value: string | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      experienciaLaboralDTO: prev.experienciaLaboralDTO.map((exp, i) =>
        i === index ? { ...exp, [field]: value || null } : exp
      ),
    }))
  }

  const validateForm = () => {
    const required = [
      "nombre",
      "apellido",
      "email",
      "carrera",
      "fechaNacimiento",
      "fechaIngreso",
      "fechaEgreso",
    ]
    for (const field of required) {
      if (!formData[field as keyof FormData]) return false
    }
    if (formData.ponderado <= 0 || formData.ponderado > 20) return false
    for (const exp of formData.experienciaLaboralDTO) {
      if (!exp.empresa || !exp.cargo || !exp.fechaIngreso) return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/graduates/registerGraduates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Error al registrar egresado")

      alert("Egresado registrado correctamente")
      modalRef.current?.close()
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        carrera: "",
        fechaNacimiento: "",
        fechaIngreso: "",
        fechaEgreso: "",
        ponderado: 0,
        experienciaLaboralDTO: [],
      })
    } catch {
      alert("No se pudo registrar el egresado")
    } finally {
      setLoading(false)
      window.location.reload()
    }
  }

  return (
    <>
      <button
        onClick={() => modalRef.current?.showModal()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + Nuevo
      </button>

      <dialog
        ref={modalRef}
        className="rounded-md w-full max-w-2xl p-0 shadow-xl mx-auto self-center"
      >
        <form onSubmit={handleSubmit} method="dialog" className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Registrar Egresado</h2>
            <button type="button" onClick={() => modalRef.current?.close()}>
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <input
              required
              placeholder="Apellido"
              value={formData.apellido}
              onChange={(e) => handleInputChange("apellido", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full col-span-2"
            />
            <input
              required
              placeholder="Carrera"
              value={formData.carrera}
              onChange={(e) => handleInputChange("carrera", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full col-span-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <fieldset>
              <label className="text-sm">Fecha de nacimiento</label>
              <input
                required
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) =>
                  handleInputChange("fechaNacimiento", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </fieldset>
            <fieldset>
              <label className="text-sm">Fecha de ingreso</label>
              <input
                required
                type="date"
                value={formData.fechaIngreso}
                onChange={(e) =>
                  handleInputChange("fechaIngreso", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </fieldset>
            <fieldset>
              <label className="text-sm">Fecha de egreso</label>
              <input
                required
                type="date"
                value={formData.fechaEgreso}
                onChange={(e) =>
                  handleInputChange("fechaEgreso", e.target.value)
                }
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
              value={formData.ponderado}
              onChange={(e) =>
                handleInputChange("ponderado", parseFloat(e.target.value))
              }
              placeholder="Ponderado"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </fieldset>

          <div>
            <div className="flex justify-between items-center">
              <label className="font-medium">
                Experiencia Laboral (opcional)
              </label>
              <button
                type="button"
                onClick={addExperiencia}
                className="text-sm text-blue-600 hover:underline"
              >
                + Agregar
              </button>
            </div>
            {formData.experienciaLaboralDTO.map((exp, i) => (
              <div key={i} className="border p-4 rounded mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <strong>Experiencia {i + 1}</strong>
                  <button
                    type="button"
                    onClick={() => removeExperiencia(i)}
                    className="text-red-600"
                  >
                    🗑️
                  </button>
                </div>
                <input
                  placeholder="Empresa"
                  value={exp.empresa}
                  onChange={(e) =>
                    updateExperiencia(i, "empresa", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                  placeholder="Cargo"
                  value={exp.cargo}
                  onChange={(e) =>
                    updateExperiencia(i, "cargo", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                  type="date"
                  value={exp.fechaIngreso}
                  onChange={(e) =>
                    updateExperiencia(i, "fechaIngreso", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                  type="date"
                  value={exp.fechaSalida || ""}
                  onChange={(e) =>
                    updateExperiencia(i, "fechaSalida", e.target.value || null)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
            ))}
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
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
