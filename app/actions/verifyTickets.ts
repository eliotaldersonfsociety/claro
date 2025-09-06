'use server'
import { db } from '@/lib/db'

type VerifyTicketsParams = {
  identifier: string // teléfono o cédula
}

export async function verifyTickets({ identifier }: VerifyTicketsParams) {
  try {
    if (!identifier) {
      return { success: false, message: 'Debes ingresar un teléfono o cédula' }
    }

    const result = await db.execute({
      sql: `
        SELECT t.ticket_number, e.full_name, e.id_number, e.phone
        FROM raffle_ticket t
        JOIN raffle_entry e ON t.entry_id = e.id
        WHERE e.phone = ? OR e.id_number = ?
      `,
      args: [identifier, identifier],
    })

    if (!result.rows.length) {
      return { success: false, message: 'No se encontraron boletos para este identificador' }
    }

    // Parsear JSON de todos los tickets
    const tickets: number[] = result.rows.flatMap(row => {
      try {
        return JSON.parse(
          typeof row.ticket_number === 'string'
            ? row.ticket_number
            : JSON.stringify(row.ticket_number ?? [])
        )
      } catch (err) {
        console.warn('Error parsing tickets JSON:', row.ticket_number)
        return []
      }
    })

    return {
      success: true,
      tickets,
      fullName: result.rows[0].full_name,
      phone: result.rows[0].phone,
    }
  } catch (error: any) {
    console.error('Error en verifyTickets:', error)
    return { success: false, message: error.message || 'Error interno del servidor' }
  }
}
