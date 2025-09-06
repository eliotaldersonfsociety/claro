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
        SELECT 
          t.ticket_number,
          e.full_name,
          e.id_number,
          e.phone,
          e.country_code,
          e.country_name,
          e.payment_reference,
          e.account_holder,
          e.file_path,
          e.file_name,
          e.mime_type
        FROM raffle_ticket t
        JOIN raffle_entry e ON t.entry_id = e.id
        WHERE e.phone = ? OR e.id_number = ?
        LIMIT 1  -- Solo necesitamos una fila, los tickets se extraen de ticket_number
      `,
      args: [identifier, identifier],
    })

    if (!result.rows.length) {
      return { success: false, message: 'No se encontraron boletos para este identificador' }
    }

    const row = result.rows[0]

    // Parsear JSON de los tickets
    let tickets: number[] = []
    try {
      tickets = JSON.parse(
        typeof row.ticket_number === 'string'
          ? row.ticket_number
          : JSON.stringify(row.ticket_number ?? [])
      )
    } catch (err) {
      console.warn('Error parsing tickets JSON:', row.ticket_number)
      tickets = []
    }

    // Devolver TODOS los datos del cliente + boletos
    return {
      success: true,
      tickets,
      customer: {
        fullName: row.full_name,
        idNumber: row.id_number,
        phone: row.phone,
        countryCode: row.country_code,
        countryName: row.country_name,
        paymentReference: row.payment_reference,
        accountHolder: row.account_holder,
        fileUrl: row.file_path,
        fileName: row.file_name,
        mimeType: row.mime_type,
      },
    }
  } catch (error: any) {
    console.error('Error en verifyTickets:', error)
    return { success: false, message: error.message || 'Error interno del servidor' }
  }
}
