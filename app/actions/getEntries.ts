// app/actions/getEntries.ts
'use server'

import { db } from '@/lib/db'

export async function getEntries() {
  try {
    const result = await db.execute({
      sql: `
        SELECT e.id, e.full_name, e.id_number, e.phone, e.country_name,
               e.payment_reference, e.account_holder,
               e.file_path, e.file_name, e.mime_type,
               t.ticket_number
        FROM raffle_entry e
        LEFT JOIN raffle_ticket t ON e.id = t.entry_id
        ORDER BY e.id DESC
      `,
    })

    // Agrupar boletos por entrada
    const entries: Record<number, any> = {}
    for (const row of result.rows as any[]) {
      const id = row.id
      if (!entries[id]) {
        entries[id] = {
          id: row.id,
          fullName: row.full_name,
          idNumber: row.id_number,
          phone: row.phone,
          countryName: row.country_name,
          paymentReference: row.payment_reference,
          accountHolder: row.account_holder,
          filePath: row.file_path,
          fileName: row.file_name,
          mimeType: row.mime_type,
          tickets: [],
        }
      }

      if (row.ticket_number) {
        try {
          const nums = JSON.parse(row.ticket_number)
          if (Array.isArray(nums)) {
            entries[id].tickets = [...entries[id].tickets, ...nums]
          } else {
            entries[id].tickets.push(row.ticket_number)
          }
        } catch {
          entries[id].tickets.push(row.ticket_number)
        }
      }
    }

    // Añadir conteo de boletos
    const entriesWithCount = Object.values(entries).map(entry => ({
      ...entry,
      ticketCount: entry.tickets.length
    }))

    return { success: true, data: entriesWithCount }
  } catch (error: any) {
    console.error('❌ Error en getEntries:', error)
    return { success: false, message: error.message || 'Error al obtener entradas' }
  }
}