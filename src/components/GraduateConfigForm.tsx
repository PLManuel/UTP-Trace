import { useEffect, useState } from "react"

interface ExperienciaLaboral {
  id: number
  empresa: string
  cargo: string
  fechaIngreso: string
  fechaSalida: string | null
  numerocontacto?: number
  numeroDeEmpresa?: number
  paginaWebEmpresa?: string
  direccion?: string
}

interface GraduateData {
  id: number
  nombre: string
  apellido: string
  email: string
  carrera: string
  universidad: string
  facultad: string
  especialidad: string
  contraseña: string
  fechaNacimiento: string
  fechaIngreso: string
  fechaEgreso: string
  ponderado: number
  idExperienciaLaboral: ExperienciaLaboral[]
  historialActualizacion: any[]
}

export default function GraduateConfigForm({
  idGraduate,
}: {
  idGraduate: number
}) {
  const [graduate, setGraduate] = useState<GraduateData | null>(null)
  const [form, setForm] = useState<Partial<GraduateData>>({})
  const [descripcion, setDescripcion] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchGraduate = async () => {
    try {
      const res = await fetch(`/api/graduates/getGraduate?id=${idGraduate}`)
      const result = await res.json()
      const parsed =
        typeof result.error === "string" ? JSON.parse(result.error) : result
      setGraduate(parsed)
      setForm({ ...parsed, contraseña: "" })
      setDescripcion("")
    } catch (err) {
      alert("Error al cargar los datos del egresado")
    }
  }

  useEffect(() => {
    fetchGraduate()
  }, [])

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

    const experienciaOriginal = graduate?.idExperienciaLaboral || []
    const experienciaActual = form.idExperienciaLaboral || []

    const experienciaLaboralDTO =
      experienciaActual.length > experienciaOriginal.length
        ? experienciaActual.slice(experienciaOriginal.length).map((exp) => ({
            empresa: exp.empresa,
            cargo: exp.cargo,
            fechaIngreso: exp.fechaIngreso,
            fechaSalida: exp.fechaSalida,
            numerocontacto: exp.numerocontacto,
            numeroDeEmpresa: exp.numeroDeEmpresa,
            paginaWebEmpresa: exp.paginaWebEmpresa,
            direccion: exp.direccion,
          }))
        : undefined

    const toISOStringWithTimezone = (dateStr: string) =>
      new Date(dateStr).toISOString().replace("Z", "+00:00")

    const payload = {
      id: form.id,
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      carrera: form.carrera,
      universidad: form.universidad,
      facultad: form.facultad,
      especialidad: form.especialidad,
      contraseña: form.contraseña,
      fechaNacimiento: toISOStringWithTimezone(form.fechaNacimiento!),
      fechaIngreso: toISOStringWithTimezone(form.fechaIngreso!),
      fechaEgreso: toISOStringWithTimezone(form.fechaEgreso!),
      ponderado: form.ponderado,
      ...(experienciaLaboralDTO && { experienciaLaboralDTO }),
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
    } catch {
      alert("Error al actualizar egresado")
    } finally {
      setLoading(false)
      window.location.reload()
    }
  }

  return (
    <form
      method="dialog"
      className="flex flex-col h-full"
      onSubmit={handleSubmit}
    >
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Actualizar Egresado</h2>
              <p className="text-blue-100 text-sm">
                Modifica la información del graduado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Información Personal */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Información Personal
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nombre
              </label>
              <input
                required
                value={form.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Ingresa el nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              />
            </fieldset>

            <fieldset className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Apellido
              </label>
              <input
                required
                value={form.apellido || ""}
                onChange={(e) => handleChange("apellido", e.target.value)}
                placeholder="Ingresa el apellido"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              />
            </fieldset>

            <fieldset className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Correo Electrónico
              </label>
              <input
                required
                type="email"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              />
            </fieldset>
            <fieldset className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Contraseña *
              </label>
              <input
                required
                type="password"
                value={form.contraseña || ""}
                onChange={(e) => handleChange("contraseña", e.target.value)}
                placeholder="Ingresa una nueva contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              />
            </fieldset>
          </div>
        </div>

        {/* Información Académica */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Información Académica
            </h3>
          </div>

          <div className="space-y-6">
            <fieldset className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Carrera
              </label>
              <input
                required
                value={form.carrera || ""}
                onChange={(e) => handleChange("carrera", e.target.value)}
                placeholder="Nombre de la carrera"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
              />
            </fieldset>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <fieldset className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Fecha de Nacimiento
                </label>
                <input
                  required
                  type="date"
                  value={form.fechaNacimiento?.split("T")[0] || ""}
                  onChange={(e) =>
                    handleChange("fechaNacimiento", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                />
              </fieldset>

              <fieldset className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Fecha de Ingreso
                </label>
                <input
                  required
                  type="date"
                  value={form.fechaIngreso?.split("T")[0] || ""}
                  onChange={(e) => handleChange("fechaIngreso", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                />
              </fieldset>

              <fieldset className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Fecha de Egreso
                </label>
                <input
                  required
                  type="date"
                  value={form.fechaEgreso?.split("T")[0] || ""}
                  onChange={(e) => handleChange("fechaEgreso", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                />
              </fieldset>
            </div>

            <fieldset className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Ponderado
              </label>
              <input
                required
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={form.ponderado || ""}
                onChange={(e) =>
                  handleChange("ponderado", Number.parseFloat(e.target.value))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="0.0"
              />
            </fieldset>

            <fieldset className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Universidad
              </label>
              <input
                required
                value={form.universidad || ""}
                onChange={(e) => handleChange("universidad", e.target.value)}
                placeholder="Nombre de la universidad"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
              />
            </fieldset>

            <fieldset className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Facultad
              </label>
              <input
                required
                value={form.facultad || ""}
                onChange={(e) => handleChange("facultad", e.target.value)}
                placeholder="Nombre de la facultad"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
              />
            </fieldset>

            <fieldset className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Especialidad
              </label>
              <input
                required
                value={form.especialidad || ""}
                onChange={(e) => handleChange("especialidad", e.target.value)}
                placeholder="Nombre de la especialidad"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
              />
            </fieldset>
          </div>
        </div>

        {/* Experiencia Laboral */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Experiencia Laboral
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  idExperienciaLaboral: [
                    ...(prev.idExperienciaLaboral || []),
                    {
                      id: Date.now(),
                      empresa: "",
                      cargo: "",
                      fechaIngreso: "",
                      fechaSalida: "",
                    },
                  ],
                }))
              }
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 transform hover:scale-105"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Agregar Experiencia
            </button>
          </div>

          <div className="space-y-6">
            {form.idExperienciaLaboral?.map((exp, index) => (
              <div
                key={exp.id}
                className="bg-white border border-purple-200 rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-1.5 rounded-md mr-2">
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">
                    Experiencia {index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <fieldset className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={exp.empresa}
                      onChange={(e) =>
                        handleExpChange(index, "empresa", e.target.value)
                      }
                      placeholder="Nombre de la empresa"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white text-sm"
                    />
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={exp.cargo}
                      onChange={(e) =>
                        handleExpChange(index, "cargo", e.target.value)
                      }
                      placeholder="Cargo desempeñado"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white text-sm"
                    />
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Fecha de Ingreso
                    </label>
                    <input
                      type="date"
                      value={exp.fechaIngreso?.split("T")[0]}
                      onChange={(e) =>
                        handleExpChange(index, "fechaIngreso", e.target.value)
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white text-sm"
                    />
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Fecha de Salida
                    </label>
                    <input
                      type="date"
                      value={exp.fechaSalida?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleExpChange(index, "fechaSalida", e.target.value)
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white text-sm"
                    />
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Número de contacto personal
                    </label>
                    <input
                      type="number"
                      value={exp.numerocontacto || ""}
                      onChange={(e) =>
                        handleExpChange(index, "numerocontacto", e.target.value)
                      }
                      placeholder="Ej: 923456789"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white text-sm"
                    />
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Número de la empresa
                    </label>
                    <input
                      type="number"
                      value={exp.numeroDeEmpresa || ""}
                      onChange={(e) =>
                        handleExpChange(
                          index,
                          "numeroDeEmpresa",
                          e.target.value
                        )
                      }
                      placeholder="Ej: 998877665"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white text-sm"
                    />
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Página web de la empresa
                    </label>
                    <input
                      type="url"
                      value={exp.paginaWebEmpresa || ""}
                      onChange={(e) =>
                        handleExpChange(
                          index,
                          "paginaWebEmpresa",
                          e.target.value
                        )
                      }
                      placeholder="https://empresa.com"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white text-sm"
                    />
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={exp.direccion || ""}
                      onChange={(e) =>
                        handleExpChange(index, "direccion", e.target.value)
                      }
                      placeholder="Dirección de la empresa"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white text-sm"
                    />
                  </fieldset>
                </div>
              </div>
            ))}

            {(!form.idExperienciaLaboral ||
              form.idExperienciaLaboral.length === 0) && (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Sin experiencia laboral
                </h4>
                <p className="text-gray-600 mb-4">
                  Agrega la experiencia laboral del egresado
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Descripción de Modificación */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 p-2 rounded-lg mr-3">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Descripción de Modificación
            </h3>
          </div>

          <fieldset className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Describe brevemente los cambios realizados *
            </label>
            <textarea
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm resize-none"
              rows={4}
              placeholder="Ejemplo: Actualización de información de contacto y experiencia laboral reciente. Se modificó el correo electrónico y se agregó nueva experiencia en la empresa XYZ..."
            />
          </fieldset>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Actualizando...
              </span>
            ) : (
              "Actualizar Egresado"
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
