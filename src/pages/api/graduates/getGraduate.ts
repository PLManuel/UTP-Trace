import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ cookies, url }) => {
  const token = cookies.get("authToken")?.value

  if (!token) {
    return new Response(JSON.stringify({ error: "Token no proporcionado" }), {
      status: 401,
    })
  }

  const id = new URL(url).searchParams.get("id")

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID de egresado no especificado" }),
      {
        status: 400,
      }
    )
  }

  console.log(`http://localhost:8080/egresado/obtener/${id}`)

  try {
    const response = await fetch(
      `http://localhost:8080/egresado/obtener/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ error: errorText || "Error al obtener egresado" }),
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
    console.error("Error al recuperar egresado:", error)
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
      }
    )
  }
}
