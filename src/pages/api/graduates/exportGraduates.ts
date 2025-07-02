import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("authToken")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Token no proporcionado" }), {
      status: 401,
    });
  }

  try {
    const response = await fetch("http://localhost:8080/egresado/exportarEgresadoYExperienciaAExcel", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: errorText || "Error al obtener egresados" }),
        {
          status: response.status,
        }
      );
    }

    // ⚠️ CORREGIDO: tratamos la respuesta como binario
    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="egresados.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error al recuperar egresado:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
      }
    );
  }
};
