// app/actions/verifyTickets.ts
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
          e.mime_type,
          e.created_at
        FROM raffle_ticket t
        JOIN raffle_entry e ON t.entry_id = e.id
        WHERE e.phone = ? OR e.id_number = ?
        ORDER BY e.created_at DESC
      `,
      args: [identifier, identifier],
    })

    if (!result.rows.length) {
      return { success: false, message: 'No se encontraron boletos para este identificador' }
    }

    // Agrupar por compra: cada fila es una compra distinta
    const purchases = result.rows.map((row) => {
      let tickets: number[] = []
      try {
        const parsed = JSON.parse(
          typeof row.ticket_number === 'string'
            ? row.ticket_number
            : JSON.stringify(row.ticket_number ?? [])
        )
        if (Array.isArray(parsed)) {
          tickets = parsed
        }
      } catch (err) {
        console.warn('Error parsing tickets JSON:', row.ticket_number)
      }

      return {
        tickets: tickets,
        fullName: String(row.full_name),
        idNumber: String(row.id_number),
        phone: String(row.phone),
        countryCode: String(row.country_code),
        countryName: String(row.country_name),
        paymentReference: String(row.payment_reference),
        accountHolder: String(row.account_holder),
        fileUrl: row.file_path ? String(row.file_path) : undefined,
        fileName: row.file_name ? String(row.file_name) : undefined,
        mimeType: row.mime_type ? String(row.mime_type) : undefined,
        createdAt: row.created_at ? new Date(row.created_at).toLocaleString('es-CR') : 'Fecha desconocida',
      }
    })

    // Extraer todos los tickets combinados (para el resumen global)
    const allTickets = purchases.flatMap(p => p.tickets)

    return {
      success: true,
      tickets: allTickets,
      purchases: purchases, // 👈 ¡Ahora enviamos todas las compras!
      customer: purchases[0] || null, // Para compatibilidad con el frontend antiguo (opcional)
    }
  } catch (error: any) {
    console.error('Error en verifyTickets:', error)
    return { success: false, message: error.message || 'Error interno del servidor' }
  }
}
