import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("authToken")?.value

  if (!token) {
    return new Response(JSON.stringify({ error: "Token no proporcionado" }), {
      status: 401,
    })
  }

  try {
    const response = await fetch(
      "http://localhost:8080/egresado/obtener/todos",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ error: errorText || "Error al obtener egresados" }),
        {
          status: response.status,
        }
      )
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
      }
    )
  }
}
