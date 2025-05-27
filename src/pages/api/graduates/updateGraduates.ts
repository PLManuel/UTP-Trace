import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get("authToken")?.value

    if (!token) {
      return new Response(JSON.stringify({ error: "Token no proporcionado" }), {
        status: 401,
      })
    }

    const data = await request.json()

    if (
      !data.id ||
      !data.historialActualizaciones?.idUsuario ||
      !data.historialActualizaciones?.descripción
    ) {
      return new Response(
        JSON.stringify({ error: "Datos incompletos para la actualización" }),
        {
          status: 400,
        }
      )
    }

    const response = await fetch("http://localhost:8080/egresado/actualizar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ error: errorText || "Error al actualizar egresado" }),
        {
          status: response.status,
        }
      )
    }

    const updated = await response.json()
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error en la actualización:", error)
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
      }
    )
  }
}
