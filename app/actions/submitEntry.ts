// app/actions/submitEntry.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

type SubmitEntryParams = {
  ticketNumbers: number[]
  fullName: string
  idNumber: string
  phone: string
  countryCode: string
  countryName: string
  paymentReference: string
  accountHolder: string
  fileUrl: string
  fileName: string
  mimeType: string
  comment?: string
}

export async function submitEntry(data: SubmitEntryParams) {
  try {
    // Validaciones básicas
    if (!data.fullName || !data.idNumber || !data.phone) {
      return { success: false, message: 'Faltan datos obligatorios' }
    }
    if (!data.ticketNumbers || data.ticketNumbers.length === 0) {
      return { success: false, message: 'Debes seleccionar boletos' }
    }
    if (!data.fileUrl) {
      return { success: false, message: 'Debes subir un comprobante' }
    }

    // 1️⃣ Consultar si los boletos ya están vendidos
    const placeholders = data.ticketNumbers.map(() => '?').join(',')
    const soldTicketsResult = await db.execute({
      sql: `SELECT ticket_number FROM raffle_ticket WHERE ticket_number IN (${placeholders})`,
      args: data.ticketNumbers
    })

    const soldTickets = soldTicketsResult.rows?.map((r: any) => r.ticket_number) || []

    if (soldTickets.length > 0) {
      return {
        success: false,
        message: `Los siguientes boletos ya están vendidos: ${soldTickets.join(', ')}`
      }
    }

    // 2️⃣ Insertar la entrada
    const entry = await db.execute({
      sql: `
        INSERT INTO raffle_entry (
          full_name, id_number, phone, country_code, country_name,
          payment_reference, account_holder, file_path, file_name, mime_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        data.fullName,
        data.idNumber,
        data.phone,
        data.countryCode,
        data.countryName,
        data.paymentReference,
        data.accountHolder,
        data.fileUrl,
        data.fileName,
        data.mimeType
      ]
    })

    const entryId = entry.lastInsertRowid ? Number(entry.lastInsertRowid) : null
    if (!entryId) throw new Error('No se pudo obtener el ID de la entrada')

    // 3️⃣ Insertar boletos uno por uno
      await db.execute({
        sql: `INSERT INTO raffle_ticket (entry_id, ticket_number) VALUES (?, ?)`,
        args: [entryId, JSON.stringify(data.ticketNumbers)]
      })

    // ✅ Revalidar path
    revalidatePath('/')

    return { success: true, message: 'Registro exitoso' }

  } catch (error: any) {
    console.error('❌ Error en submitEntry:', error)
    return { success: false, message: error.message || 'Error en el servidor' }
  }
}
