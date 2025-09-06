// app/actions/deleteEntry.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function deleteEntry(entryId: number) {
  try {
    // Primero eliminar boletos asociados
    await db.execute({
      sql: `DELETE FROM raffle_ticket WHERE entry_id = ?`,
      args: [entryId],
    })

    // Luego eliminar la entrada
    await db.execute({
      sql: `DELETE FROM raffle_entry WHERE id = ?`,
      args: [entryId],
    })

    revalidatePath('/dashboard')

    return { success: true, message: 'Entrada eliminada correctamente' }
  } catch (error: any) {
    console.error('❌ Error en deleteEntry:', error)
    return { success: false, message: error.message || 'Error al eliminar la entrada' }
  }
}
