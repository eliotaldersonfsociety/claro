// src/server/helpers/getSoldTickets.ts
'use server'
import { createClient } from '@libsql/client'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export async function getSoldTickets(): Promise<number[]> {
  try {
    const result = await turso.execute({
      sql: "SELECT ticket_number FROM raffle_ticket",
      args: {}
    })

    // ✅ Convertir JSON a números y aplanar todos los arrays
    const soldTickets: number[] = result.rows.flatMap(row => {
      try {
        const tickets = JSON.parse(
          typeof row.ticket_number === 'string'
            ? row.ticket_number
            : JSON.stringify(row.ticket_number ?? [])
        ) as number[]
        return tickets
      } catch (err) {
        console.warn('Error parsing tickets JSON:', row.ticket_number)
        return []
      }
    })

    return soldTickets
  } catch (error) {
    console.error('Error al obtener boletos vendidos:', error)
    return [] // fallback: ningún boleto vendido
  }
}
