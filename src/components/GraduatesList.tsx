import { useState, useEffect, Fragment } from "react"
import UpdateGraduates from "../components/UpdateGraduates"

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Cargando egresados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <span className="text-red-500 text-xl mr-3">⚠️</span>
          <div>
            <h3 className="text-red-800 font-medium">Error al cargar datos</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchEgresados}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (egresados.length === 0) {
    return (
      <div className="text-center p-8">
        <span className="text-6xl mb-4 block">📚</span>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay egresados
        </h3>
        <p className="text-gray-600">Aún no se han registrado egresados.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Egresado",
                  "Carrera",
                  "Fechas",
                  "Ponderado",
                  "Experiencia",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {egresados.map((e) => (
                <Fragment key={e.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {e.nombre} {e.apellido}
                      </div>
                      <div className="text-sm text-gray-500">{e.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e.carrera}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>Nacimiento: {formatDate(e.fechaNacimiento)}</div>
                      <div>Ingreso: {formatDate(e.fechaIngreso)}</div>
                      <div>Egreso: {formatDate(e.fechaEgreso)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          e.ponderado >= 17
                            ? "bg-green-100 text-green-800"
                            : e.ponderado >= 12
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {e.ponderado.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e.idExperienciaLaboral.length > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {e.idExperienciaLaboral.length} experiencia
                          {e.idExperienciaLaboral.length !== 1 && "s"}
                        </span>
                      ) : (
                        <span className="text-gray-400">Sin experiencia</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex flex-col">
                      <button
                        onClick={() => toggleRow(e.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {expandedRows.has(e.id) ? "▼" : "▶"} Detalles
                      </button>
                      <UpdateGraduates idGraduate={e.id} />
                    </td>
                  </tr>

                  {expandedRows.has(e.id) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">
                            Experiencia Laboral
                          </h4>
                          {e.idExperienciaLaboral.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                              {e.idExperienciaLaboral.map((exp) => (
                                <div
                                  key={exp.id}
                                  className="border rounded-lg p-4 bg-white"
                                >
                                  <div className="font-medium">
                                    {exp.empresa}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <div>Cargo: {exp.cargo}</div>
                                    <div>
                                      Inicio: {formatDate(exp.fechaIngreso)}
                                    </div>
                                    <div>
                                      Fin:{" "}
                                      {exp.fechaSalida
                                        ? formatDate(exp.fechaSalida)
                                        : "Actual"}
                                      {!exp.fechaSalida && (
                                        <span className="ml-2 inline-flex px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                          Activo
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">
                              No tiene experiencia registrada.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
