import { useState, useEffect, useRef } from "react"

interface User {
  id: number
  nombre: string | null
  apellido: string | null
  email: string
  telefono: number
}

interface DeleteModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (userId: number) => void
  loading: boolean
}

export default function DeleteModal({ user, isOpen, onClose, onConfirm, loading }: DeleteModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal()
    } else if (!isOpen && modalRef.current) {
      modalRef.current.close()
    }
  }, [isOpen])

  if (!user) return null

  return (
    <dialog
      ref={modalRef}
      className="rounded-2xl w-full max-w-md p-0 shadow-2xl mx-auto backdrop:bg-black/60 border-0 bg-transparent"
      onClose={onClose}
    >
      <div className="bg-white rounded-2xl overflow-hidden">
        <form method="dialog" onSubmit={(e) => e.preventDefault()}>
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Confirmar Eliminación</h2>
                <p className="text-red-100 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">¿Estás seguro de eliminar este usuario?</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ID:</span> {user.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nombre:</span>{" "}
                    {user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : "Sin nombre"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono:</span> {user.telefono || "No registrado"}
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-800">Advertencia</p>
                    <p className="text-sm text-red-700 mt-1">
                      Esta acción eliminará permanentemente la cuenta del usuario y todos sus datos asociados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => onConfirm(user.id)}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Eliminando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar Usuario
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  )
}