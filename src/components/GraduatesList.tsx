import { useState, useEffect } from "react"
import DeleteGraduateButton from "../components/DeleteGraduateButton"
import RegisterGraduates from "./RegisterGraduates"
import ExportGraduatesButton from "./ExportGraduatesButton"
import UpdateGraduates from "./UpdateGraduates"

interface ExperienciaLaboral {
  id: number
  empresa: string
  cargo: string
  fechaIngreso: string
  fechaSalida: string | null
}

interface Egresado {
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

export default function GraduatesList() {
  const [egresados, setEgresados] = useState<Egresado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCarrera, setFilterCarrera] = useState("")

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const updated = new Set(prev)
      updated.has(id) ? updated.delete(id) : updated.add(id)
      return updated
    })
  }

  const fetchEgresados = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/graduates/getAllGraduates")
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      setEgresados(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEgresados()
  }, [])

  const filteredEgresados = egresados.filter((egresado) => {
    const matchesSearch =
      egresado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      egresado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      egresado.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCarrera =
      filterCarrera === "" || egresado.carrera === filterCarrera

    return matchesSearch && matchesCarrera
  })

  // Obtener carreras únicas para el filtro
  const carreras = [...new Set(egresados.map((e) => e.carrera))]

  const getPonderadoColor = (ponderado: number) => {
    if (ponderado >= 17) return "from-green-500 to-emerald-600"
    if (ponderado >= 12) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-red-600"
  }

  const getPonderadoTextColor = (ponderado: number) => {
    if (ponderado >= 17) return "text-green-700"
    if (ponderado >= 12) return "text-yellow-700"
    return "text-red-700"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Cargando egresados
          </h3>
          <p className="text-gray-600">
            Obteniendo información de la base de datos...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold text-lg">
                Error al cargar datos
              </h3>
              <p className="text-red-600 text-sm mt-1 leading-relaxed">
                {error}
              </p>
              <button
                onClick={fetchEgresados}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (egresados.length === 0) {
    return (
      <div className="text-center p-12">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No hay egresados registrados
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-5">
          Aún no se han registrado egresados en el sistema. Los datos aparecerán
          aquí una vez que se agreguen.
        </p>
        <RegisterGraduates />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex gap-2">
            <RegisterGraduates />
            <ExportGraduatesButton />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 w-full sm:w-64"
              />
            </div>

            <select
              value={filterCarrera}
              onChange={(e) => setFilterCarrera(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              <option value="">Todas las carreras</option>
              {carreras.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEgresados.map((egresado) => (
          <div
            key={egresado.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-lg">
                      {egresado.nombre.charAt(0)}
                      {egresado.apellido.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {egresado.nombre} {egresado.apellido}
                    </h3>
                    <p className="text-gray-600 text-sm">{egresado.email}</p>
                    <p className="text-blue-600 text-sm font-medium">
                      {egresado.carrera}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 lg:gap-6">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getPonderadoColor(
                        egresado.ponderado
                      )} text-white shadow-lg`}
                    >
                      {egresado.ponderado.toFixed(1)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Ponderado</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
                      {egresado.idExperienciaLaboral.length}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Experiencias</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleRow(egresado.id)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      className={`w-4 h-4 mr-1 transition-transform duration-200 ${
                        expandedRows.has(egresado.id) ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Detalles
                  </button>
                  <div className="relative group">
                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                      <svg
                        className="w-4 h-4 mr-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Acciones
                    </button>
                    <div className="absolute right-0 mt-2 overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 hidden flex-col group-focus-within:flex z-50 w-fit">
                      <UpdateGraduates idGraduate={egresado.id}/>
                      <DeleteGraduateButton
                        idGraduate={egresado.id}
                        graduateName={egresado.nombre}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Nacimiento:{" "}
                      <span className="font-medium text-gray-900">
                        {formatDate(egresado.fechaNacimiento)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Ingreso:{" "}
                      <span className="font-medium text-gray-900">
                        {formatDate(egresado.fechaIngreso)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Egreso:{" "}
                      <span className="font-medium text-gray-900">
                        {formatDate(egresado.fechaEgreso)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {expandedRows.has(egresado.id) && (
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                  Experiencia Laboral
                </h4>

                {egresado.idExperienciaLaboral.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {egresado.idExperienciaLaboral.map((exp) => (
                      <div
                        key={exp.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-lg">
                              {exp.empresa}
                            </h5>
                            <p className="text-blue-600 font-medium">
                              {exp.cargo}
                            </p>
                          </div>
                          {!exp.fechaSalida && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                              Activo
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Inicio: {formatDate(exp.fechaIngreso)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              Fin:{" "}
                              {exp.fechaSalida
                                ? formatDate(exp.fechaSalida)
                                : "Actual"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 italic">
                      No tiene experiencia laboral registrada
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEgresados.length === 0 && egresados.length > 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  )
}
