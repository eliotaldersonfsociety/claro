// app/components/TicketVerifier.tsx
'use client'

import { useState } from 'react'
import { verifyTickets } from '@/app/actions/verifyTickets'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export function TicketVerifier() {
  const [identifier, setIdentifier] = useState('')
  const [tickets, setTickets] = useState<number[] | null>(null)
  const [purchases, setPurchases] = useState<Array<{
    tickets: number[]
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
    createdAt: string
  }> | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setMessage(null)
    setTickets(null)
    setPurchases(null)

    const res = await verifyTickets({ identifier })

    if (res.success) {
      setTickets(res.tickets ?? null)
      setPurchases(res.purchases ?? null)

      if ((res.tickets?.length ?? 0) === 0) {
        setMessage('No se encontraron boletos para este usuario')
      }
    } else {
      setMessage(res.message)
    }

    setLoading(false)
  }

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
      <Card className="border-0 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl">
        <div className="text-center">
          <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
            <div className="bg-stone-950 w-fit text-s text-white py-3 px-6 rounded-full flex items-center space-x-2">
              <h2 className="text-lg sm:text-3xl font-black flex items-center justify-center space-x-1 sm:space-x-3">
                <img src="/verificado.png" alt="Boletas" className="w-6 h-6" />
                <span className="text-balance"><b>Verificador de boletos</b></span>
              </h2>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto mb-4">
          <Input
            placeholder="Ingresa tu número de cédula o teléfono"
            className="text-center text-white"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white mb-4"
          onClick={handleSearch}
          disabled={loading || !identifier}
        >
          {loading ? 'Buscando...' : 'Buscar boletos'}
        </Button>

        {message && <p className="text-center text-red-400 mt-4">{message}</p>}

        {/* Resumen global de tickets */}
        {tickets && tickets.length > 0 && (
          <div className="text-center mt-6">
            <h3 className="text-white font-bold mb-2">
              {tickets.length} boleto{tickets.length !== 1 ? 's' : ''} encontrados:
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {tickets.map((t) => (
                <span
                  key={t}
                  className="bg-yellow-500 text-black px-3 py-1 rounded-md font-mono font-bold text-sm sm:text-base"
                >
                  {t.toString().padStart(4, '0')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Lista de compras individuales */}
        {purchases && purchases.length > 0 && (
          <div className="mt-8 space-y-6">
            <h3 className="text-white font-bold text-xl border-b border-gray-600 pb-2">
              {purchases.length} compra{purchases.length !== 1 ? 's' : ''} realizada{s}
            </h3>

            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800 rounded-lg text-white border border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg">Compra #{index + 1}</h4>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    {purchase.createdAt}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div><strong>Nombre:</strong> {purchase.fullName}</div>
                  <div><strong>Cédula:</strong> {purchase.idNumber}</div>
                  <div><strong>Teléfono:</strong> {purchase.phone}</div>
                  <div><strong>País:</strong> {purchase.countryName} ({purchase.countryCode})</div>
                  <div><strong>Referencia de pago:</strong> <code className="bg-gray-700 px-2 py-1 rounded text-xs">{purchase.paymentReference}</code></div>
                  <div><strong>Titular de cuenta:</strong> {purchase.accountHolder}</div>
                </div>

                {/* Tickets de esta compra */}
                <div className="mb-3">
                  <strong>Tickets:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {purchase.tickets.length > 0 ? (
                      purchase.tickets.map((t) => (
                        <span
                          key={t}
                          className="bg-yellow-500 text-black px-2 py-1 rounded-md font-mono text-xs"
                        >
                          {t.toString().padStart(4, '0')}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Sin tickets</span>
                    )}
                  </div>
                </div>

                {/* Comprobante */}
                {purchase.fileUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <strong>Comprobante de pago:</strong>
                    {purchase.mimeType?.startsWith('image/') ? (
                      <div className="mt-2">
                        <img
                          src={purchase.fileUrl}
                          alt="Comprobante"
                          className="max-h-32 max-w-full rounded border border-gray-600"
                        />
                      </div>
                    ) : purchase.mimeType === 'application/pdf' ? (
                      <div className="mt-2">
                        <Link
                          href={purchase.fileUrl}
                          target="_blank"
                          className="text-blue-400 underline hover:text-blue-300 text-sm"
                        >
                          📄 Ver PDF: {purchase.fileName}
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <a
                          href={purchase.fileUrl}
                          target="_blank"
                          className="text-blue-400 underline hover:text-blue-300 text-sm"
                        >
                          📎 Descargar archivo: {purchase.fileName}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Si hay tickets pero no compras (caso raro) */}
        {tickets && tickets.length > 0 && !purchases && (
          <p className="text-center text-yellow-300 mt-6">
            Se encontraron boletos, pero no se pudieron asociar a compras. Contacta al soporte.
          </p>
        )}
      </Card>
    </div>
  )
}
