import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json()

    console.log(data)

    if (!data.correo || !data.contraseña) {
      return new Response(JSON.stringify({ error: "Campos incompletos" }), {
        status: 400,
      })
    }

    const payload = {
      email: data.correo,
      contraseña: data.contraseña,
    }

    const response = await fetch("http://localhost:8080/egresado/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const responseData = await response.json()

    console.log(JSON.stringify(payload))

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: responseData.message || "Error en inicio de sesión",
        }),
        { status: response.status }
      )
    }

    cookies.set("authToken", responseData.token, {
      path: "/",
      httpOnly: true,
      secure: !import.meta.env.DEV,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    })

    cookies.set(
      "userInfo",
      encodeURIComponent(
        JSON.stringify({
          id: responseData.egresado.id,
          nombre: responseData.egresado.nombre,
          apellido: responseData.egresado.apellido,
          correo: responseData.egresado.email,
          telefono: responseData.egresado.telefono,
          rol: "EGRESADO",
        })
      ),
      {
        path: "/",
        httpOnly: false,
        secure: !import.meta.env.DEV,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
      }
    )

    return new Response(JSON.stringify({ redirectTo : "/dashboard" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error en login:", error)
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    })
  }
}
