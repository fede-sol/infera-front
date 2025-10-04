import { NextResponse } from "next/server"

// Mock de decisiones en memoria (se pierde al reiniciar)
let decisiones = []

// GET - Obtener todas las decisiones
export async function GET() {
  return NextResponse.json({ decisiones })
}

// POST - Crear nueva decisión
export async function POST(request) {
  try {
    const body = await request.json()
    const nuevaDecision = {
      id: `${Date.now()}`,
      ...body,
      fecha: new Date().toISOString(),
    }
    decisiones = [nuevaDecision, ...decisiones]
    return NextResponse.json({ decision: nuevaDecision }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creando decisión:", error)
    return NextResponse.json({ error: "Error al crear decisión" }, { status: 500 })
  }
}

// PATCH - Actualizar decisión
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, ...datos } = body

    decisiones = decisiones.map((d) => (d.id === id ? { ...d, ...datos } : d))

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Error actualizando decisión:", error)
    return NextResponse.json({ error: "Error al actualizar decisión" }, { status: 500 })
  }
}

// DELETE - Eliminar decisión
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    decisiones = decisiones.filter((d) => d.id !== id)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Error eliminando decisión:", error)
    return NextResponse.json({ error: "Error al eliminar decisión" }, { status: 500 })
  }
}
