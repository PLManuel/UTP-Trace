import { useRef, useState, useEffect } from "react"

export default function AdminRegisterModal() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
    type: "success" | "error"
  }>({
    show: false,
    message: "",
    type: "success",
  })

  const openModal = () => {
    modalRef.current?.showModal()
  }

  const closeModal = () => {
    modalRef.current?.close()
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 5000)
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }))
  }

  const validateField = (
    field: HTMLInputElement,
    validator: (value: string) => boolean,
    errorMessage: string
  ) => {
    const errorElement = field.parentElement?.querySelector(
      ".error-message"
    ) as HTMLElement

    const validate = () => {
      const isValid = validator(field.value.trim())

      if (field.value.trim() === "") {
        field.classList.remove("border-red-500", "border-green-500")
        errorElement?.classList.add("hidden")
      } else if (isValid) {
        field.classList.remove("border-red-500")
        field.classList.add("border-green-500")
        errorElement?.classList.add("hidden")
      } else {
        field.classList.remove("border-green-500")
        field.classList.add("border-red-500")
        if (errorElement) {
          errorElement.textContent = errorMessage
          errorElement.classList.remove("hidden")
        }
      }
    }

    field.addEventListener("blur", validate)
    field.addEventListener("input", validate)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const nombre = data.nombre.toString().trim()
    const apellido = data.apellido.toString().trim()
    const telefono = data.telefono.toString().trim()
    const correo = data.correo.toString().trim()
    const contraseña = data.contraseña.toString()
    const rol = data.rol.toString()

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const telefonoRegex = /^9\d{2}\d{3}\d{3}$/
    const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    const contraseñaMinLength = 8
    const rolOptions = ["ADMINISTRADOR"]

    if (!nombreApellidoRegex.test(nombre)) {
      showNotification("El nombre solo debe contener letras", "error")
      return
    }

    if (!nombreApellidoRegex.test(apellido)) {
      showNotification("El apellido solo debe contener letras", "error")
      return
    }

    if (!telefonoRegex.test(telefono)) {
      showNotification(
        "El teléfono debe comenzar con 9 y tener 9 dígitos",
        "error"
      )
      return
    }

    if (!emailRegex.test(correo)) {
      showNotification("Ingresa un correo electrónico válido", "error")
      return
    }

    if (contraseña.length < contraseñaMinLength) {
      showNotification(
        "La contraseña debe tener al menos 8 caracteres",
        "error"
      )
      return
    }

    if (!rolOptions.includes(rol)) {
      showNotification("Debe seleccionar un rol válido", "error")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/registerUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          correo,
          contraseña,
          telefono,
          rol,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al registrar usuario")
      }

      showNotification("Usuario registrado correctamente", "success")

      // Reset form
      const form = e.currentTarget
      form.reset()

      // Remove validation styles
      const inputs = form.querySelectorAll("input, select")
      inputs.forEach((input) => {
        input.classList.remove("border-red-500", "border-green-500")
      })

      const errorMessages = form.querySelectorAll(".error-message")
      errorMessages.forEach((error) => {
        error.classList.add("hidden")
      })

      // Close modal after successful registration
      setTimeout(() => {
        closeModal()
      }, 2000)
    } catch (err) {
      if (err instanceof Error) {
        showNotification(err.message, "error")
      } else {
        showNotification("Error desconocido", "error")
      }
    } finally {
      setLoading(false)
      window.location.href = "/dashboard/usuarios"
    }
  }

  const togglePassword = (targetName: string) => {
    const input = document.querySelector(
      `input[name="${targetName}"]`
    ) as HTMLInputElement
    if (input) {
      input.type = input.type === "password" ? "text" : "password"
    }
  }

  useEffect(() => {
    const setupValidation = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const telefonoRegex = /^9\d{2}\d{3}\d{3}$/
      const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
      const contraseñaMinLength = 8

      const nombreField = document.querySelector(
        'input[name="nombre"]'
      ) as HTMLInputElement
      const apellidoField = document.querySelector(
        'input[name="apellido"]'
      ) as HTMLInputElement
      const telefonoField = document.querySelector(
        'input[name="telefono"]'
      ) as HTMLInputElement
      const correoField = document.querySelector(
        'input[name="correo"]'
      ) as HTMLInputElement
      const contraseñaField = document.querySelector(
        'input[name="contraseña"]'
      ) as HTMLInputElement

      if (nombreField)
        validateField(
          nombreField,
          (value) => nombreApellidoRegex.test(value),
          "El nombre solo debe contener letras"
        )
      if (apellidoField)
        validateField(
          apellidoField,
          (value) => nombreApellidoRegex.test(value),
          "El apellido solo debe contener letras"
        )
      if (telefonoField)
        validateField(
          telefonoField,
          (value) => telefonoRegex.test(value),
          "El teléfono debe comenzar con 9 y tener 9 dígitos"
        )
      if (correoField)
        validateField(
          correoField,
          (value) => emailRegex.test(value),
          "Ingresa un correo electrónico válido"
        )
      if (contraseñaField)
        validateField(
          contraseñaField,
          (value) => value.length >= contraseñaMinLength,
          "La contraseña debe tener al menos 8 caracteres"
        )
    }

    // Setup validation when modal opens
    const modal = modalRef.current
    if (modal) {
      modal.addEventListener("open", setupValidation)
      return () => modal.removeEventListener("open", setupValidation)
    }
  }, [])

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        Registrar Administrador
      </button>

      {/* Modal Dialog */}
      <dialog
        ref={modalRef}
        className="rounded-2xl w-full max-w-2xl p-0 shadow-2xl m-auto backdrop:bg-black/60 border-0 bg-transparent max-h-[90vh]"
      >
        <div className="bg-white rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    Registrar Administrador
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Crea una nueva cuenta de administrador
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                  <fieldset className="space-y-2">
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-500"
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
                        Nombre
                      </span>
                    </label>
                    <input
                      name="nombre"
                      type="text"
                      placeholder="Ingresa el nombre"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                    />
                    <div className="error-message hidden text-red-600 text-sm mt-1"></div>
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label
                      htmlFor="apellido"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-500"
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
                        Apellido
                      </span>
                    </label>
                    <input
                      name="apellido"
                      type="text"
                      placeholder="Ingresa el apellido"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                    />
                    <div className="error-message hidden text-red-600 text-sm mt-1"></div>
                  </fieldset>
                </div>
              </div>

              {/* Información de Contacto */}
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Información de Contacto
                  </h3>
                </div>

                <div className="space-y-6">
                  <fieldset className="space-y-2">
                    <label
                      htmlFor="telefono"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Teléfono
                      </span>
                    </label>
                    <input
                      name="telefono"
                      placeholder="Ej: 936369072"
                      type="tel"
                      pattern="^9[0-9]{8}$"
                      minLength={9}
                      maxLength={9}
                      title="El número debe empezar con 9 y tener 9 dígitos"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                    />
                    <div className="error-message hidden text-red-600 text-sm mt-1"></div>
                    <p className="text-xs text-gray-500">
                      Debe comenzar con 9 y tener 9 dígitos
                    </p>
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label
                      htmlFor="correo"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                        Correo Electrónico
                      </span>
                    </label>
                    <input
                      name="correo"
                      type="email"
                      placeholder="admin@ejemplo.com"
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                    />
                    <div className="error-message hidden text-red-600 text-sm mt-1"></div>
                  </fieldset>
                </div>
              </div>

              {/* Información de Seguridad */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center mb-6">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Información de Seguridad
                  </h3>
                </div>

                <div className="space-y-6">
                  <fieldset className="space-y-2">
                    <label
                      htmlFor="contraseña"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Contraseña
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        name="contraseña"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("contraseña")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="w-5 h-5 text-gray-400 hover:text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="error-message hidden text-red-600 text-sm mt-1"></div>
                    <p className="text-xs text-gray-500">
                      Debe tener al menos 8 caracteres
                    </p>
                  </fieldset>

                  <fieldset className="space-y-2">
                    <label
                      htmlFor="rol"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Rol del Usuario
                      </span>
                    </label>
                    <select
                      name="rol"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                    </select>
                    <div className="error-message hidden text-red-600 text-sm mt-1"></div>
                  </fieldset>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
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
                      Registrando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Registrar Administrador
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm ${
              notification.type === "success"
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className={`w-5 h-5 ${
                    notification.type === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {notification.type === "success" ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={closeNotification}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
