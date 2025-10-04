import { NextResponse } from "next/server"

// Health check endpoint para verificar que la app está funcionando
export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: "Infera MVP",
    version: "1.0.0",
  })
}
