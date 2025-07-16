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

    if (!data.id) {
      return new Response(
        JSON.stringify({ error: "Datos incompletos para eliminar egresado" }),
        {
          status: 400,
        }
      )
    }

    const response = await fetch(
      `http://localhost:8080/egresado/eliminar/${data.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ error: errorText || "Error al ELIMINAR egresado" }),
        {
          status: response.status,
        }
      )
    }

    return new Response()
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
