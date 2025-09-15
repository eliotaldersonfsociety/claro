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
          e.mime_type
        FROM raffle_ticket t
        JOIN raffle_entry e ON t.entry_id = e.id
        WHERE e.phone = ? OR e.id_number = ?
        ORDER BY e.created_at ASC
      `,
      args: [identifier, identifier],
    })

    if (!result.rows.length) {
      return { success: false, message: 'No se encontraron boletos para este identificador' }
    }

    let allTickets: number[] = []
    let customerData: {
      fullName: string
      idNumber: string
      phone: string
      countryCode: string
      countryName: string
      paymentReference: string
      accountHolder: string
      fileUrl?: string
      fileName?: string
      mimeType?: string
    } | null = null

    for (const row of result.rows) {
      // Parsear tickets de cada compra
      try {
        const tickets = JSON.parse(
          typeof row.ticket_number === 'string'
            ? row.ticket_number
            : JSON.stringify(row.ticket_number ?? [])
        )
        if (Array.isArray(tickets)) {
          allTickets = [...allTickets, ...tickets]
        }
      } catch (err) {
        console.warn('Error parsing tickets JSON:', row.ticket_number)
      }

      // Tomar los datos del cliente desde la primera fila (asumimos que son consistentes)
      if (!customerData) {
        customerData = {
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
        }
      }
    }

    // Si no hay tickets válidos, retornar array vacío pero éxito
    if (allTickets.length === 0) {
      return {
        success: true,
        tickets: [],
        customer: customerData || null,
      }
    }

    return {
      success: true,
      tickets: allTickets,
      customer: customerData,
    }
  } catch (error: any) {
    console.error('Error en verifyTickets:', error)
    return { success: false, message: error.message || 'Error interno del servidor' }
  }
}
