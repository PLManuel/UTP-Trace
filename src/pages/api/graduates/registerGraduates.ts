import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json()
    const token = cookies.get("authToken")?.value

    if (!token) {
      return new Response(JSON.stringify({ error: "Token no proporcionado" }), {
        status: 401,
      })
    }

    const response = await fetch("http://localhost:8080/egresado/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        contraseña: data.password,
        carrera: data.carrera,
        fechaNacimiento: data.fechaNacimiento,
        fechaIngreso: data.fechaIngreso,
        fechaEgreso: data.fechaEgreso,
        ponderado: data.ponderado,
        experienciaLaboralDTO: data.experienciaLaboralDTO,
        universidad: data.universidad,
        facultad: data.facultad,
        especialidad: data.especialidad,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({ error: errorText }), {
        status: response.status,
      })
    }

    const responseData = await response.json()
    console.log("Registro exitoso:", responseData)
    return new Response(JSON.stringify(responseData), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error en el registro:", error)
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
      }
    )
  }
}
