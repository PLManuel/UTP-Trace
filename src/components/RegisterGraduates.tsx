import { useRef, useState } from "react"

interface ExperienciaLaboral {
  empresa: string
  cargo: string
  fechaIngreso: string
  fechaSalida: string | null
  numerocontacto?: number
  numeroDeEmpresa?: number
  paginaWebEmpresa?: string
  direccion?: string
}

interface FormData {
  nombre: string
  apellido: string
  email: string
  password: string
  carrera: string
  universidad: string
  facultad: string
  especialidad: string
  fechaNacimiento: string
  fechaIngreso: string
  fechaEgreso: string
  ponderado: number
  experienciaLaboralDTO: ExperienciaLaboral[]
}

interface ValidationErrors {
  [key: string]: string
}

export default function RegisterGraduates() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    carrera: "",
    universidad: "",
    facultad: "",
    especialidad: "",
    fechaNacimiento: "",
    fechaIngreso: "",
    fechaEgreso: "",
    ponderado: 0,
    experienciaLaboralDTO: [],
  })

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addExperiencia = () => {
    setFormData((prev) => ({
      ...prev,
      experienciaLaboralDTO: [
        ...prev.experienciaLaboralDTO,
        {
          empresa: "",
          cargo: "",
          fechaIngreso: "",
          fechaSalida: null,
          numerocontacto: undefined,
          numeroDeEmpresa: undefined,
          paginaWebEmpresa: "",
          direccion: "",
        },
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
    const newErrors: ValidationErrors = {}

    // Validaciones básicas
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    if (!formData.apellido.trim())
      newErrors.apellido = "El apellido es obligatorio"
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio"
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido"
    if (!formData.password.trim())
      newErrors.password = "La contraseña es obligatoria"
    else if (formData.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    if (!formData.carrera.trim())
      newErrors.carrera = "La carrera es obligatoria"
    if (!formData.fechaNacimiento)
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria"
    if (!formData.fechaIngreso)
      newErrors.fechaIngreso = "La fecha de ingreso es obligatoria"
    if (!formData.fechaEgreso)
      newErrors.fechaEgreso = "La fecha de egreso es obligatoria"
    if (formData.ponderado <= 0 || formData.ponderado > 20) {
      newErrors.ponderado = "El ponderado debe estar entre 0.1 y 20"
    }

    if (!formData.universidad.trim())
      newErrors.universidad = "La universidad es obligatoria"
    if (!formData.facultad.trim())
      newErrors.facultad = "La facultad es obligatoria"
    if (!formData.especialidad.trim())
      newErrors.especialidad = "La especialidad es obligatoria"

    // Validar fechas lógicas
    if (formData.fechaIngreso && formData.fechaEgreso) {
      if (new Date(formData.fechaIngreso) >= new Date(formData.fechaEgreso)) {
        newErrors.fechaEgreso =
          "La fecha de egreso debe ser posterior al ingreso"
      }
    }

    // Validar experiencias laborales
    formData.experienciaLaboralDTO.forEach((exp, index) => {
      if (exp.empresa && (!exp.cargo || !exp.fechaIngreso)) {
        newErrors[`experiencia_${index}`] =
          "Complete todos los campos de la experiencia"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
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

      // Mostrar mensaje de éxito
      modalRef.current?.close()
      resetForm()

      // Mostrar notificación de éxito (podrías usar una librería de toast aquí)
      alert("¡Egresado registrado correctamente!")
    } catch (error) {
      console.error("Error:", error)
      alert("No se pudo registrar el egresado. Intente nuevamente.")
    } finally {
      setLoading(false)
      window.location.reload()
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      carrera: "",
      especialidad: "",
      universidad: "",
      facultad: "",
      fechaNacimiento: "",
      fechaIngreso: "",
      fechaEgreso: "",
      ponderado: 0,
      experienciaLaboralDTO: [],
    })
    setErrors({})
    setCurrentStep(1)
    setShowPassword(false)
  }

  const openModal = () => {
    modalRef.current?.showModal()
    resetForm()
  }

  const closeModal = () => {
    modalRef.current?.close()
    resetForm()
  }

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault() // Prevenir cualquier comportamiento de submit

    if (currentStep === 1) {
      // Validar solo los campos del paso 1
      const step1Fields = ["nombre", "apellido", "email", "password", "carrera"]
      const hasStep1Errors = step1Fields.some((field) => {
        const value = formData[field as keyof FormData]
        if (field === "password") {
          return !value || (value as string).length < 6
        }
        return !value
      })

      if (!hasStep1Errors) {
        setCurrentStep(2)
      } else {
        validateForm()
      }
    } else if (currentStep === 2) {
      // Validar solo los campos del paso 2
      const step2Fields = [
        "fechaNacimiento",
        "fechaIngreso",
        "fechaEgreso",
        "ponderado",
      ]
      const hasStep2Errors = step2Fields.some((field) => {
        const value = formData[field as keyof FormData]
        if (field === "ponderado") {
          return typeof value !== "number" || value <= 0 || value > 20
        }
        return !value
      })

      // Validar fechas lógicas
      const fechaIngresoDate = new Date(formData.fechaIngreso)
      const fechaEgresoDate = new Date(formData.fechaEgreso)
      const hasDateError = fechaIngresoDate >= fechaEgresoDate

      if (!hasStep2Errors && !hasDateError) {
        setCurrentStep(3)
      } else {
        validateForm()
      }
    }
  }

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault() // Prevenir cualquier comportamiento de submit
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg
          className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Nuevo Egresado
      </button>

      <dialog
        ref={modalRef}
        className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-transparent p-0 max-w-4xl w-full rounded-2xl shadow-2xl open:animate-in open:fade-in open:zoom-in-95 m-auto open:duration-300"
      >
        <div className="bg-white rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Registrar Nuevo Egresado
                  </h2>
                  <p className="text-sm text-gray-600">
                    Complete la información del egresado
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center mt-4 space-x-4">
              <div
                className={`flex items-center ${
                  currentStep >= 1 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">
                  Información Personal
                </span>
              </div>
              <div
                className={`w-8 h-0.5 ${
                  currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center ${
                  currentStep >= 2 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">
                  Fechas y Académico
                </span>
              </div>
              <div
                className={`w-8 h-0.5 ${
                  currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center ${
                  currentStep >= 3 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 3
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium">
                  Experiencia Laboral
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Step 1: Información Personal */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Información Personal
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) =>
                          handleInputChange("nombre", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                          errors.nombre
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        placeholder="Ingrese el nombre"
                      />
                      {errors.nombre && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.nombre}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) =>
                          handleInputChange("apellido", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                          errors.apellido
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        placeholder="Ingrese el apellido"
                      />
                      {errors.apellido && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.apellido}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      placeholder="ejemplo@correo.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                          errors.password
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carrera *
                    </label>
                    <input
                      type="text"
                      value={formData.carrera}
                      onChange={(e) =>
                        handleInputChange("carrera", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                        errors.carrera
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      placeholder="Ingrese la carrera"
                    />
                    {errors.carrera && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.carrera}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Fechas y Académico */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                    <h3 className="text-lg font-semibold text-gray-900">
                      Fechas y Información Académica
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={(e) =>
                          handleInputChange("fechaNacimiento", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                          errors.fechaNacimiento
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      {errors.fechaNacimiento && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fechaNacimiento}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Ingreso *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaIngreso}
                        onChange={(e) =>
                          handleInputChange("fechaIngreso", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                          errors.fechaIngreso
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      {errors.fechaIngreso && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fechaIngreso}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Egreso *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaEgreso}
                        onChange={(e) =>
                          handleInputChange("fechaEgreso", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                          errors.fechaEgreso
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      {errors.fechaEgreso && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fechaEgreso}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ponderado (0.1 - 20.0) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="20"
                      value={formData.ponderado || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "ponderado",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                        errors.ponderado
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      placeholder="Ej: 16.5"
                    />
                    {errors.ponderado && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.ponderado}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Universidad *
                    </label>
                    <input
                      type="text"
                      value={formData.universidad}
                      onChange={(e) =>
                        handleInputChange("universidad", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200"
                      placeholder="Ingrese la universidad"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facultad *
                    </label>
                    <input
                      type="text"
                      value={formData.facultad}
                      onChange={(e) =>
                        handleInputChange("facultad", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200"
                      placeholder="Ingrese la facultad"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidad *
                    </label>
                    <input
                      type="text"
                      value={formData.especialidad}
                      onChange={(e) =>
                        handleInputChange("especialidad", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200"
                      placeholder="Ingrese la especialidad"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Experiencia Laboral */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
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
                      <h3 className="text-lg font-semibold text-gray-900">
                        Experiencia Laboral
                      </h3>
                      <span className="text-sm text-gray-500">(Opcional)</span>
                    </div>
                    <button
                      type="button"
                      onClick={addExperiencia}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Agregar Experiencia
                    </button>
                  </div>

                  {formData.experienciaLaboralDTO.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                      <p className="text-gray-500 mb-4">
                        No hay experiencias laborales agregadas
                      </p>
                      <button
                        type="button"
                        onClick={addExperiencia}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Agregar Primera Experiencia
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.experienciaLaboralDTO.map((exp, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900">
                              Experiencia {index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeExperiencia(index)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Empresa
                              </label>
                              <input
                                type="text"
                                value={exp.empresa}
                                onChange={(e) =>
                                  updateExperiencia(
                                    index,
                                    "empresa",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="Nombre de la empresa"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cargo
                              </label>
                              <input
                                type="text"
                                value={exp.cargo}
                                onChange={(e) =>
                                  updateExperiencia(
                                    index,
                                    "cargo",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="Cargo desempeñado"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Ingreso
                              </label>
                              <input
                                type="date"
                                value={exp.fechaIngreso}
                                onChange={(e) =>
                                  updateExperiencia(
                                    index,
                                    "fechaIngreso",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Salida
                                <span className="text-gray-500 text-xs ml-1">
                                  (Opcional si aún trabaja)
                                </span>
                              </label>
                              <input
                                type="date"
                                value={exp.fechaSalida || ""}
                                onChange={(e) =>
                                  updateExperiencia(
                                    index,
                                    "fechaSalida",
                                    e.target.value || null
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número de contacto consultas
                              </label>
                              <input
                                type="number"
                                value={exp.numerocontacto || ""}
                                onChange={(e) =>
                                  updateExperiencia(
                                    index,
                                    "numerocontacto",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 923456789"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número de la empresa
                              </label>
                              <input
                                type="number"
                                value={exp.numeroDeEmpresa || ""}
                                onChange={(e) =>
                                  updateExperiencia(
                                    index,
                                    "numeroDeEmpresa",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 998877665"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Página web de la empresa
                              </label>
                              <input
                                type="url"
                                value={exp.paginaWebEmpresa || ""}
                                onChange={(e) =>
                                  updateExperiencia(
                                    index,
                                    "paginaWebEmpresa",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://empresa.com"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dirección
                              </label>
                              <input
                                type="text"
                                value={exp.direccion || ""}
                                onChange={(e) =>
                                  updateExperiencia(
                                    index,
                                    "direccion",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Dirección de la empresa"
                              />
                            </div>
                          </div>

                          {errors[`experiencia_${index}`] && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors[`experiencia_${index}`]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with navigation */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
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
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Anterior
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="flex space-x-3">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Siguiente
                      <svg
                        className="w-4 h-4 ml-2"
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
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
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
                          Registrando...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Registrar Egresado
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}
