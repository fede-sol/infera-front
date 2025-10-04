import { NextResponse } from "next/server"

// Mock de prueba de escritura en Notion
export async function POST(request) {
  try {
    const body = await request.json()
    const { workspace, base } = body

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock: siempre exitoso
    return NextResponse.json({
      ok: true,
      url: "https://notion.so/fake-demo-test",
      workspace,
      base,
    })
  } catch (error) {
    console.error("[v0] Error en test-notion:", error)
    return NextResponse.json({ ok: false, error: "Error al probar conexión" }, { status: 500 })
  }
}
